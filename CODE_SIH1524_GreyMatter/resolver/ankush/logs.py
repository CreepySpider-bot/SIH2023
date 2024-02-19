import logging
import os
# import time
from datetime import datetime

def get_file_name():
    if os.path.exists("logs"):
        pass
    else:
        os.mkdir("logs")
        
    name = datetime.now().strftime("%Y-%m-%d") + ".log"
    if os.path.exists(f"logs/{name}"):
        return f"logs/{name}"
    else:
        with open(f"logs/{name}", "w") as f:
            f.write("")
    
    return f"logs/{name}"

logging.basicConfig(filename=get_file_name(),level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def log_info(msg):
    logger.info(msg)

def log_error(msg):
    logger.error(msg)

def log_warning(msg):
    logger.warning(msg)

def log_debug(msg):
    logger.debug(msg)