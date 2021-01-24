from selenium import webdriver
from selenium.webdriver.common.keys import Keys 
import time
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--use-fake-ui-for-media-stream")



PATH="/Users/gracew/Downloads/chromedriver"
driver = webdriver.Chrome(executable_path=PATH, chrome_options=chrome_options)
driver.get("https://gracewsquared.netlify.app/")
time.sleep(2)

button = driver.find_element_by_xpath('//*[@id="root"]/div/main/div/a[2]')
button.click()
time.sleep(2)

for el in driver.find_elements_by_class_name("form-control"): 
    if (el.get_attribute("placeholder")=="1/1/2021"):
        el.send_keys("1/25/2021")
        time.sleep(2)
    elif (el.get_attribute("value") == ""):        
        el.send_keys("something")
button = driver.find_element_by_xpath('//*[@id="root"]/div/main/div/div/form/input')
button.click() 
time.sleep(2)

passwordLine = driver.find_element_by_xpath('//*[@id="root"]/div/main/div/div/h2')
password = passwordLine.text.split(": ")[1]

home = driver.find_element_by_xpath('//*[@id="root"]/div/main/div/div/a')
home.click()
time.sleep(2)

topicsList = driver.find_element_by_xpath('//*[@id="root"]/div/main/div/a[1]')
topicsList.click()

time.sleep(2)

for el in driver.find_elements_by_tag_name('h2'):
    if (el.text=="something"):
        el.click()
        time.sleep(2)

el = driver.find_element_by_tag_name('button')
if (el.text=="View details"):
    el.click()
    time.sleep(2)

el = driver.find_element_by_class_name('signUp')
if (el.text=="Enter Debate Room"):
    el.click()
    time.sleep(2)

for el in driver.find_elements_by_class_name("form-control"): 
    if (el.get_attribute("placeholder")=="password"):
        el.send_keys(password)
        time.sleep(2)
    else:     
        el.send_keys("selenium")

el = driver.find_element_by_tag_name('button')
el.click()




