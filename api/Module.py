import pymongo
from bson import ObjectId
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import GPT4AllEmbeddings
import json
import os

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return json.JSONEncoder.default(obj)

def get_rag_data():
    client = pymongo.MongoClient("mongodb+srv://adnanchayma23:s1Huel3upjLKysk8@cluster0.cs9ywhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client["mealster"]
    
    restaurants_collection = db["restaurants"]
    menus_collection = db["menu"]
    food_collection = db["plat"]
    
    restaurants = list(restaurants_collection.find({}))
    menus = list(menus_collection.find({}))
    food = list(food_collection.find({}))
    
    food_dict = {str(item['_id']): item for item in food}
    menus_dict = {str(item['_id']): item for item in menus}

    # Replacing each food ID with the corresponding food document
    for menu in menus:    
        menu["items"] = [food_dict[str(food_id)] for food_id in menu["items"]]
    # Replacing each menu ID with the corresponding menu document
    for restaurant in restaurants:    
        restaurant["menus"] = [menus_dict[str(menu_id)] for menu_id in restaurant["menus"]]

    os.mkdir('./Data')
    with open('./Data/data.json', 'w') as json_file:
        json.dump(restaurants, json_file, cls=CustomEncoder)

    return restaurants

def load_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as json_file:
        data = json.load(json_file)
    return data

def generate_text_from_data():
    json_file_path = "Data/data.json"
    data = load_data(json_file_path)
    generated_text = []
    
    for restaurant in data:
        title = restaurant.get("title", "")
        address = restaurant.get("address", "")
        phone = restaurant.get("phone", "")
        
        restaurant_text = f"Restaurant: {title}\nAddress: {address}\nPhone: {phone}\n\n"
        
        for menu in restaurant.get("menus", []):
            menu_title = menu.get("title", "")
            
            restaurant_text += f"Menu: {menu_title}\n"
            
            for item in menu.get("items", []):
                item_name = item.get("name", "")
                item_description = item.get("description", "")
                item_price = item.get("price", "")
                
                restaurant_text += f"- {item_name}: {item_description}. Price: {item_price}\n"
                
        generated_text.append(restaurant_text)
    return generated_text

def create_or_load_vectorstore(generated_text):
    persist_directory = "vector_storage"
    if not os.path.exists(persist_directory):
        print("Creating vectorstore for the first time...")
        # os.mkdir(persist_directory)
        vectorstore = Chroma.from_texts(
            texts=generated_text,
            collection_name="rag-chroma",
            embedding=GPT4AllEmbeddings(),
            persist_directory=persist_directory
        )
    else:
        print("Loading vectorstore from persistent directory...")
        vectorstore = Chroma(persist_directory="vector_storage", collection_name="rag-chroma", embedding_function=GPT4AllEmbeddings())
    return vectorstore
