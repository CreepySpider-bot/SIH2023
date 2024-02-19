import pickle
import pandas as pd
import datetime
import pytz
import cabby
from lxml import etree

class AVLNode:
    def __init__(self, key):
        self.key = key
        self.height = 1
        self.left = None
        self.right = None

class AVLTree:
    def __init__(self):
        self.root = None

    def height(self, node):
        if node is None:
            return 0
        return node.height

    def balance_factor(self, node):
        if node is None:
            return 0
        return self.height(node.left) - self.height(node.right)

    def rotate_right(self, y):
        x = y.left
        T2 = x.right

        x.right = y
        y.left = T2

        y.height = 1 + max(self.height(y.left), self.height(y.right))
        x.height = 1 + max(self.height(x.left), self.height(x.right))

        return x

    def rotate_left(self, x):
        y = x.right
        T2 = y.left

        y.left = x
        x.right = T2

        x.height = 1 + max(self.height(x.left), self.height(x.right))
        y.height = 1 + max(self.height(y.left), self.height(y.right))

        return y

    def insert(self, root, key):
        if root is None:
            return AVLNode(key)

        if key < root.key:
            root.left = self.insert(root.left, key)
        elif key > root.key:
            root.right = self.insert(root.right, key)
        else:
            return root

        root.height = 1 + max(self.height(root.left), self.height(root.right))

        balance = self.balance_factor(root)

        # Left Heavy
        if balance > 1:
            if key < root.left.key:
                return self.rotate_right(root)
            else:
                root.left = self.rotate_left(root.left)
                return self.rotate_right(root)

        # Right Heavy
        if balance < -1:
            if key > root.right.key:
                return self.rotate_left(root)
            else:
                root.right = self.rotate_right(root.right)
                return self.rotate_left(root)

        return root

    def insert_domain(self, key):
        self.root = self.insert(self.root, key)



    def search(self, root, key):
        if root is None or root.key == key:
            return root

        if key < root.key:
            return self.search(root.left, key)
        return self.search(root.right, key)

    def search_domain(self, key):
        return self.search(self.root, key)

    def inorder_traversal(self, root, result):
        if root:
            self.inorder_traversal(root.left, result)
            result.append(root.key)
            self.inorder_traversal(root.right, result)


    def save_to_file(self, filename):
        with open(filename, 'wb') as file:
            pickle.dump(self.root, file)
        print("Database Updated")

    def load_from_file(self, filename):
        try:
            with open(filename, 'rb') as file:
                self.root = pickle.load(file)
        except FileNotFoundError:
            pass  # File doesn't exist, start with an empty tree

    def search_result(self, key):
        search_result = self.search_domain(key)
        if search_result:
            print(f"{search_result.key} found!")
        else:
            print("Domain not found.")

    def build_and_save_new_tree(self):
        new_avl = AVLTree()
        new_avl.load_from_file('avl_tree_blacklist.pkl')
        taxii_server = "https://otx.alienvault.com/taxii/poll"
        collection_name = "user_AlienVault"
        username = "0725b45940f32b2423097f41154bd111c94e526d10c3fac501356be02ceb436c"
        begin_date = datetime.datetime(2023, 12, 10, 0, 0, 0, tzinfo=pytz.utc)

        # Create a TAXII client
        client = cabby.create_client(discovery_url=taxii_server, version="1.1", headers={"username": username, "password": "abcd"})

        # Get the collection for polling
        collections = client.get_collections()
        collection = next((c for c in collections if c.name == collection_name), None)

        if collection:
            # Perform the poll request
            poll_result = client.poll(collection.name, begin_date=begin_date)

            # Process the poll result
            for content_block in poll_result:
                print("Received Content Block:")


                # Parse the content block as XML
                xml_content = etree.fromstring(content_block.content)

                # Extract the domain value
                namespace = {'DomainNameObj': 'http://cybox.mitre.org/objects#DomainNameObject-1'}
                domain_element = xml_content.find('.//DomainNameObj:Value', namespaces=namespace)
                if domain_element is not None:

                  domain_value = domain_element.text

                  if new_avl.search_domain(domain_value):
                    print("Already here not inserted")
                    continue
                  else:
                    new_avl.insert_domain(domain_value)
                    print(f"{domain_value} inserted in avl")
                else:
                  print("nothing here")


            new_avl.save_to_file('avl_tree_blacklist.pkl')
            # self.load_from_file('new_avl_tree.pkl')



