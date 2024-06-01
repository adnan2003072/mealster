from flask import Flask, request
from flask_cors import CORS
from langchain.prompts import PromptTemplate
from langchain_community.chat_models import ChatOllama
from langchain_core.output_parsers import StrOutputParser
import os
import Module

app = Flask(__name__)
CORS(app)

if not os.path.exists("./Data"):
  data = Module.get_rag_data()

local_llm = "wizardlm2:7b" #stablelm2:1.6b-chat-q6_K

# setting up the vectorstore and the retriever objects
vectorstore = Module.create_or_load_vectorstore(Module.generate_text_from_data())
retriever = vectorstore.as_retriever()

@app.route("/ai", methods=["POST"])
def aiPost():
  json_content = request.json
  query = json_content.get("query")
  chatHistory = json_content.get("chatHistory")

  # Prompt template for wizardlm2:7b
  prompt = PromptTemplate(
      template = """<|SYSTEM|>Your name is Mealster, you specialize in providing personalized suggestions for meals and restaurants based on user preferences. You speak English and French.
      You are provided with context containing restaurants from Morocco with their details, and the chat history between you and the user. You keep your answer short and precise.
      ChatHistory={chatHistory}
      Context: {context}
      Input: {input}
      Answer: 
      """,
      input_variables=["input", "context", "chatHistory"],
  )
  llm = ChatOllama(model=local_llm, temperature=0)
  rag_chain = prompt | llm | StrOutputParser()
  
  docs = retriever.invoke(query)
  # print(docs)
  response = { "answer": rag_chain.invoke({"input": query, "context": docs, "chatHistory":chatHistory}) }

  return response

def start_app():
  app.run(debug=True)

if __name__ == "__main__":
  start_app()