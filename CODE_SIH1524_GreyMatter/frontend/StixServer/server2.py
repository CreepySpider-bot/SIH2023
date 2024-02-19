# import datetime
# import pytz
# import cabby

# # Set the TAXII server parameters
# taxii_server = "https://otx.alienvault.com/taxii/poll"
# collection_name = "user_AlienVault"
# username = "028dd7a38286f85d9de8bc0b8e2f93c5fc600c3c97fe31c15cf09cdd0a92702a"
# password = "foo"
# begin_date = datetime.datetime(2023, 12, 10, 0, 0, 0, tzinfo=pytz.utc)

# # Create a TAXII client
# client = cabby.create_client(discovery_url=taxii_server, version="1.1", headers={"username": username, "password": password})

# # Get the collection for polling
# collections = client.get_collections()
# collection = next((c for c in collections if c.name == collection_name), None)

# if collection:
#     # Perform the poll request
#     poll_result = client.poll(collection.name, begin_date=begin_date)

#     # Process the poll result
#     for content_block in poll_result:
#         print("Received Content Block:")
#         print(content_block.content)

# else:
#     print(f"Collection '{collection_name}' not found.")

