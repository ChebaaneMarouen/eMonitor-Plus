## **eMonitor+**

![logo](https://github.com/MxNaruto/eMonitor-Plus/blob/master/frontends/galand-client/src/assests/default-logo4.png)

eMonitor+ is a suite of digital tools developed by by UNDP’s Regional Bureau of Arab States to monitor digital media platforms using artificial intelligence tools . eMonitor+ deploys fact checking and social listening in tandem, to scans and monitor digital media, flagging issues such as electoral violations, hate speech, political polarization and online violence against women during elections. the platform is already being used by media and electoral commissions in Tunisia, Lebanon and Libya and by CSOs in Peru and currently works in five languages: Arabic, English, French, Spanish and Portuguese.
eMonitor+ uses artificial intelligence to track and analyse content on digital media, including utilizing various algorithms to, for example, conduct sentiment analysis, topic modelling, hate speech analysis, bots scanning, and reverse image verification of photographic and video sources. The platform relies on machine learning to track and analyse content on digital media, including utilizing various algorithms to, for example, conduct sentiment analysis, topic classification, hate speech analysis, and conduct reverse image and video source verification. 


## **Our five phases approach**
<B>Phase I:</B> The methodology of eMonitor+ is driven based on a bottom-up approach that includes forming the core team at the local level and working together to define the scope of the project and the areas of support and topics to be tracked.
 

<B>Phase II:</B> eMonitor+ methodology will be adapted and customized to the local context based on the country's legal framework, including laws related to elections, defining the main political actors, media outlets, influencers, and accounts to follow. In addition, developing the M&E framework and the risk and mitigation analysis.
 

<B>Phase III:</B> Increasing knowledge and skills and building capacity of the core team on the theoretical and practical approaches to digital media monitoring, combating mis/disinformation and hate speech, and prevention of violence against women online.
 

<B>Phase IV:</B> Tracking, collecting and analyzing data to be analyzed by the monitors manually and the platform's algorithms automatically. The data analysis is then visualized on a customized dashboard.
 

<B>Phase V:</B> Developing policies and recommendations driven by data and analytics, including developing a sustainability strategy at the national level and creating an environment where information is always collected and exchanged to inform policymaking.

![Our five phases](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/5_phase.png)


## **Components**

I. The Dashboard Main Home Page displays the following:

1- My Posts: Displays all posts analyzed manually by the user

2- My False News: Shows all potential false news items assigned to the fact-checker by the team leader 

3- Posts Violations: Allows the monitor to detect electoral violations on social media

4- Monitoring Violations: Contains a table of all added violations


![1](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/1.png)

Additionally, the main control interface features:

5- Recently Added News: Shows recently collected data from social media platforms.

6- Confirmed Electoral Violations: Contains all the electoral violations that have been confirmed by the team supervisor.

II.	Add new posts
a.	Social Media Post Scraping and Automated Analysis
![2](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/2.png)

In this interface, monitors can access all the articles collected and analyzed by the scraping process. Simply click on the "List of Articles" button in the side menu of the home interface.
Scraping of data is an automated method for extracting and collecting data from websites and social media platforms using APIs. eMonitor+ team set up this process, configuring the platform to monitor specific websites and social media channels regularly. The platform scrape data using Crowdtangle, Twitter API, google API. The platform then collect relevant data based on dictionary of words or set of pages/accounts.


![3](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/3.png)  

Monitors can filter the posts and refine the data collection process, using the following set of search settings: 

1. News platform (e.g., website, social media platform)
2. Social media platform (e.g., Twitter, Facebook, Instgram)
3. Period of time
4. Keywords
5. Custom search that can be saved for future use 
The platform administrator can download the data in Excel table for further explorative analysis.



III. Automatic Analysis for Hate Speech and online VAW
The platform utilizes an automatic analysis using diffrent open source algorthims including, detoxify, perspective and PERT. But also internal hate speech anaylsis which uses"Classifier Chain" as internal classifier for hate speech analysis. This process is executed according to specific parameters set by the technical administrator.


![4](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/4.png) 

This process allow monitors and users to classify and filter content using machine learning making the data sample smaller

![5](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/5.png) 
 
 
The analysis process also classifies the speech into categories such as 'normal', 'offensive', 'abusive', or 'hateful', depending on the severity of the language used. It can detect and classify specific types of speech, including:

'Insults': verbal attacks,
'Toxicity': harmful or negative language,
'Threats': expressions of intent to harm someone or something,
'Identity attacks': targeted attacks on someone's personal characteristics,
'Profanity': the use of vulgar or offensive language.
 
![6](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/6.png)
 
The filtering of posts based on machine learning enables monitors to add these posts to their workload for further analysis manually.


![7](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/7.png) 

The form is pre-filled by default, and the monitors and users can complete the remaining fields or update existing ones if necessary.



## **Deployment** 


**Installation and development** 

* Install <a name="docker-compose">https://docs.docker.com/engine/install/</a> 
* Go to config folder "compose-apps\apps"
* If you want to launch all the services

 `sudo docker-compose build`
 
 `sudo docker-compose up -d`
 
or

 `sudo docker-compose up -d --build name_service`
 
for example  
`sudo docker-compose up -d --build elasticsearch` To start our application database service

`sudo docker-compose up -d --build elasticsearch-manager` To launch the service that processes requests from our application database  

`sudo docker-compose up -d --build rabbitmq` To launch our exchange server between services.  

`sudo docker-compose up -d --build galand-client` To launch the service that manages the interface part of our platform (frontend)

`sudo docker-compose up -d --build galand-manager` To launch the service that manages the back-end part of our platform (backend)

`sudo docker-compose up -d --build nginx` To launch the service that manages the ports of our platform, you can configure it in the .env file



**Environment variables**

The apps need a number of environment variables that can be stored in a single `.env` file at the root of the project. This is the list of the variables needed:

`HTTP_PORT`=the port that will be configured for your platform, for example 8081

`HTTPS_PORT`=the port that will be configured on your platform encrypts for example 8082

`DEFAULT_ADMIN_PASSWORD`=password of your administrator account tnteap@undp.org

`CHANGE_PASSWORD_ADDR`=for configuration of new registration user on this link if your local server you can use this link http://127.0.0.1:8081/register/ otherwise http://DNS:HTTP_PORT/register/

`MAIL_HOST`=the smtp method you are going to use, for example gmail smtp.gmail.com

`MAIL_PORT`= SMTP port you are going to use like for example 587

`MONITOR_MAIL_USER`=transmission configuration email for example e.monitor@undp.org

`MONITOR_MAIL_PASS`=your email send configuration password

`MANAGER_MAIL_USER`=configuration email for sending management email e.g. e.monitor@undp.org

`MANAGER_MAIL_PASS`=password for sending configuration of your management email

`ELASTIC_PASSWORD`= password of your elastic database

`KIBANA_USER`=ID of your Kibana user

`KIBANA_PASSWORD`=KIBANA Password

`KIBANA_SECRET_TOKEN`=Kibana Secret Token

`RABBITMQ_MANAGER_USER`= ID of your RABBITMQ user

`RABBITMQ_MANAGER_PASS`=Password of your RABBITMQ user

`RABBIT_MQ_MANAGER_PORT`=Port that will be configured for RABBITMQ by default 15675

`MONITOR_USER`=ID of your monitor user which will help you track services

`MONITOR_PASSWORD`=Password of your monitor user

`GOOGLE_KEY`=token Youtube Data Api https://developers.google.com/youtube/registering_an_application

`FACEBOOK_POSTS_NUMBER`=Number of posts analyzed for each request

`FACEBOOK_COMMENTS_NUMBER`=For each post number of comments analyze

`CROWDTANGLE_ACCESS_TOKEN`=token CROWDTANGLE

`CROWDTANGLE_SEARCH_ACCOUNTS`=the list of websites to follow on your platform

`TWITTER_CONSUMER_KEY`=Twitter token for usage

`TWITTER_CONSUMER_SECRET`=secret Twitter token for use

`TWITTER_ACCESS_TOKEN_KEY`=Twitter token for access

`TWITTER_ACCESS_TOKEN_SECRET`=Twitter secret token for access

`EXCEL_COUNT_NUMBER`= Max number of analyzer positions on the platform that will be uploaded in excel sheet

`EXTERNAL_TOKEN`=token for external APIs


--------------------------------------------------------------------------------------------------------------------------------------------------------------------
The platform is founded on the efforts of UNDP Tunisia's electoral assistance project, which has designed and operated the platform since 2019. UNDP Regional Electoral Support project for the MENA region is scaling up the platform globally.   



