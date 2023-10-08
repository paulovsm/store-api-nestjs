import json
import os
import asyncio
import time
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

async def get_product_info(page):
    content = await page.content()
    soup = BeautifulSoup(content, "html.parser")
    detail_container = soup.find(class_="section-single-product")
    if detail_container:
        product_images = [ "https:" + a.find('img')['data-srcset'].split(" ")[0] for a in detail_container.find_all('a', class_='js-product-thumb') if a.find('img') and 'data-srcset' in a.find('img').attrs] 
        product_name = detail_container.find('h1', class_='js-product-name').text if detail_container.find('h1', class_='js-product-name') else None
        #product_vendor = detail_container.find('h4').text if detail_container.find('h4') else None
        product_price = detail_container.find("h2", class_="js-price-display").text if detail_container.find("h2", class_="js-price-display") else None
        #product_description = detail_container.find(class_='Product-description').text if detail_container.find(class_='Product-description') else None
        #product_buy_link = detail_container.find(id='BuyNow')['href'] if detail_container.find(id='BuyNow') else None

        product_description = None
        desc_container = soup.find(id='product-description')
        if desc_container:
            product_description = desc_container.find(class_='product-description').text if desc_container.find(class_='product-description') else None

        product_description = product_name + " - " + product_description

        # Collecting product variations values
        variation_container = soup.find("form", {"id": "product_form"})
        color_options = [option.text for option in variation_container.select('#variation_1 option') if option.text]
        size_options = [option.text for option in variation_container.select('#variation_2 option') if option.text]
    
        await page.close()  # close the page after extracting information
    
        return product_images, product_name, product_price, product_description, color_options, size_options
    return None, None, None, None, None, None, None, None

async def get_HTML_content(context, link):
    page = await context.new_page()
    await page.goto(link, timeout=60000)  # Increase timeout to 60 seconds
    await page.wait_for_selector('.section-single-product', timeout=10000)
    return page

async def process_product_info(context, data, product_category):
    updated_data = []
    max_concurrent_pages = 5  # limit the maximum number of concurrent pages
    for i in range(0, len(data), max_concurrent_pages):
        page_data = data[i: i + max_concurrent_pages]
        tasks = [get_product_info(await get_HTML_content(context, product['link'])) for product in page_data]
        results = await asyncio.gather(*tasks)
        for product, result in zip(page_data, results):
            product_images, product_name, product_price, product_description, variation_0, variation_1 = result
            product.update({
                'product_images': product_images,
                'product_name': product_name,
                'product_price': product_price,
                'product_description': product_description,
                'product_category': product_category,
                'product_variation_0': variation_0,
                'product_variation_1': variation_1
            })
            updated_data.append(product)
        time.sleep(1)  # delay between batches
    return updated_data

async def get_updated_info(context, file_path):
    product_category = file_path.split('/')[-1].split('.')[0]
    with open(file_path, 'r') as file:
        data = json.load(file)
    return await process_product_info(context, data, product_category)

async def write_to_file(output_path, updated_data):
    with open(output_path, 'w') as file:
        json.dump(updated_data, file, indent=4)

async def main(directory):
    output_directory = directory + '/output_final'
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)
    
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        context = await browser.new_context()

        for filename in os.listdir(directory):
            if filename.endswith('.json'):
                file_path = os.path.join(directory, filename)
                updated_data = await get_updated_info(context, file_path)
                output_path = os.path.join(output_directory, filename)
                await write_to_file(output_path, updated_data)
        
        await context.close()
        await browser.close()

asyncio.run(main('output_data'))