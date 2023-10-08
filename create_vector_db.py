import os
import glob
import pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.document_loaders import JSONLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain.embeddings import OpenAIEmbeddings
from typing import List
from multiprocessing import Pool
from tqdm import tqdm

# os.environ["PINECONE_API_KEY"] = getpass.getpass("Pinecone API Key:")
# os.environ["PINECONE_ENV"] = getpass.getpass("Pinecone Environment:")
# os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")

source_directory = "output_data/output_final"
chunk_size = 1000
chunk_overlap = 100

# Define the metadata extraction function.
# {
#         "title": "wide leg pants in rich tan heavyweight twill - ASOS WHITE",
#         "link": "https://shop.yesplz.ai/product/mdressshoes/asos_11448830",
#         "thumb_image_url": "https://kr-images.yesplz.ai/usdemo/mpants_asos/prd_imgs/11448830/caramelcafe_00.jpg",
#         "product_images": [
#             "https://kr-images.yesplz.ai/usdemo/mpants_asos/prd_imgs/11448830/caramelcafe_01.jpg",
#             "https://kr-images.yesplz.ai/usdemo/mpants_asos/prd_imgs/11448830/caramelcafe_03.jpg",
#             "https://kr-images.yesplz.ai/usdemo/mpants_asos/prd_imgs/11448830/caramelcafe_00.jpg",
#             "https://kr-images.yesplz.ai/usdemo/mpants_asos/prd_imgs/11448830/caramelcafe_02.jpg",
#             "https://kr-images.yesplz.ai/usdemo/mpants_asos/prd_imgs/11448830/caramelcafe_01.jpg"
#         ],
#         "product_name": "wide leg pants in rich tan heavyweight twill",
#         "product_vendor": "ASOS WHITE",
#         "product_price": "$64",
#         "product_description": "Main: 98% Cotton, 2% Spandex.\nHeavyweight twill\nRibbed, diagonal pattern\nSlightly structured, very versatile \nAn alternative to your jeans\nRegular rise\nConcealed fly\nFunctional pockets\nWide leg\nFitted at the top, flowing at the bottom",
#         "product_buy_link": "https://us.asos.com/asos-white/asos-white-wide-leg-pants-in-rich-tan-heavyweight-twill/prd/11448830?clr=caramel-cafe",
#         "product_category": "dress_shoes"
#     }
def metadata_func(record: dict, metadata: dict) -> dict:

    metadata["title"] = record.get("title")
    metadata["link"] = record.get("link")
    metadata["thumb_image_url"] = record.get("thumb_image_url")
    metadata["product_images"] = record.get("product_images")
    metadata["product_name"] = record.get("product_name")
    #metadata["product_vendor"] = record.get("product_vendor")
    metadata["product_price"] = record.get("product_price")
    #metadata["product_buy_link"] = record.get("product_buy_link")
    metadata["product_category"] = record.get("product_category")
    metadata["product_id"] = record.get("product_id")
    metadata["product_variation_0"] = record.get("product_variation_0")
    metadata["product_variation_1"] = record.get("product_variation_1")

    # if "source" in metadata:
    #     print(metadata["source"])
    #     source = metadata["source"].split("/")
    #     source = source[source.index("langchain"):]
    #     metadata["source"] = "/".join(source)

    return metadata

def load_single_document(file_path: str) -> Document:
    ext = "." + file_path.rsplit(".", 1)[-1]

    loader = JSONLoader(file_path, 
                        jq_schema='.[]',
                        content_key="product_description",
                        metadata_func=metadata_func)
    
    return loader.load()


def load_documents(source_dir: str, ignored_files: List[str] = []) -> List[Document]:
    """
    Loads all documents from the source documents directory, ignoring specified files
    """
    all_files = []
    all_files.extend(
        glob.glob(os.path.join(source_dir, f"**/*.json"), recursive=True)
    )
    filtered_files = [
        file_path for file_path in all_files if file_path not in ignored_files]

    with Pool(processes=os.cpu_count()) as pool:
        results = []
        with tqdm(total=len(filtered_files), desc='Loading new documents', ncols=80) as pbar:
            for i, docs_list in enumerate(pool.imap_unordered(load_single_document, filtered_files)):
                for doc in docs_list:
                    results.append(doc)
                    pbar.update()

    return results


def process_documents(ignored_files: List[str] = []) -> List[Document]:
    """
    Load documents and split in chunks
    """
    print(f"Loading documents from {source_directory}")
    documents = load_documents(source_directory, ignored_files)
    if not documents:
        print("No new documents to load")
        exit(0)
    print(f"Loaded {len(documents)} new documents from {source_directory}")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    texts = text_splitter.split_documents(documents)
    print(
        f"Split into {len(texts)} chunks of text (max. {chunk_size} tokens each)")
    return texts


embeddings = OpenAIEmbeddings()

print("Creating new vectorstore")
texts = process_documents()
print(f"Creating embeddings. May take some minutes...")

# initialize pinecone
pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"),  # find at app.pinecone.io
    environment=os.getenv("PINECONE_ENV"),  # next to api key in console
)

index_name = "fleek-authority-index"

# First, check if our index already exists. If it doesn't, we create it
if index_name not in pinecone.list_indexes():
    # we create a new index
    pinecone.create_index(
        name=index_name,
        metric='cosine',
        dimension=1536
    )
# The OpenAI embedding model `text-embedding-ada-002 uses 1536 dimensions`
docsearch = Pinecone.from_documents(texts, embeddings, index_name=index_name)

# if you already have an index, you can load it like this
# docsearch = Pinecone.from_existing_index(index_name, embeddings)

query = "Consider a Michael Kors Men's Non-Iron Dress Shirt. Made with 96.5% Cotton, 3.5% Spandex, this shirt offers a light feel with added stretch. Its classic fit provides a relaxed cut through the arms, chest, and waist. The shirt has a very light blue color, giving you a neat but approachable appearance."
docs = docsearch.similarity_search(query)
for doc in docs:
    print(doc.page_content)
    print(doc.metadata)