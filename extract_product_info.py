import json
import os
import asyncio
import time
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright


async def extract_product_info(context, url):

    page = await context.new_page()
    await page.goto(url, timeout=60000)  # Increase timeout to 60 seconds
    await page.wait_for_selector('.js-item-product', timeout=10000)
    content = await page.content()

    # Create BeautifulSoup object
    soup = BeautifulSoup(content, 'html.parser')

    # Find all divs with class 'js-item-product'
    products = soup.find_all('div', class_='js-item-product')

    # List to store the products
    products_result = []

    # Iterate over each product grid element
    for product in products:
        # Product ID using ['data-product-id']
        product_id = product['data-product-id']
        
        # Product URL
        link =  product.find('a')
        if link and 'href' in link.attrs:
            product_url = link['href']
        else:
            product_url = None


         # Product title
        if link and 'title' in link.attrs:
            product_title = link['title']
        else:
            product_title = None
        
        
        # Product thumbnail URL
        img = product.find('img', class_='js-item-image')
        if img and 'data-srcset' in img.attrs:
            thumbnail_url = "https:" + img['data-srcset'].split(' ')[0]
        else:
            thumbnail_url = None

        # Create a dictionary for the product
        product = {
            'product_id': product_id if product_id else "",
            'title': product_title if product_title else "",
            'link': product_url if product_url else "",
            'thumb_image_url': thumbnail_url if thumbnail_url else "",
        }

        # Add the product to the list
        if (product['product_id'] != "" and product['title'] != "" and product['link'] != "" and product['thumb_image_url'] != ""):
            products_result.append(product)

    return products_result

async def main():
    product_info = []
    folder = "./output_data"
    urls = [
        "https://fleekauthority.lojavirtualnuvem.com.br/tops",
        "https://fleekauthority.lojavirtualnuvem.com.br/bottons",
        "https://fleekauthority.lojavirtualnuvem.com.br/footwear",
        "https://fleekauthority.lojavirtualnuvem.com.br/layering",
        "https://fleekauthority.lojavirtualnuvem.com.br/accessories"
    ]

    if not os.path.exists(folder):
        os.makedirs(folder)

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        context = await browser.new_context()

        for url in urls:
            category = url.split('/')[-1]
            print(f'Extracting product info from {category}')
            output_filename = category + '.json'
            output_filepath = os.path.join(folder, output_filename)
            
            
            product_info.extend(await extract_product_info(context, url))
            
            with open(output_filepath, 'w') as json_file:
                json.dump(product_info, json_file, indent=4)
            
            product_info = []

asyncio.run(main())
