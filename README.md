## **eMonitor+**

![logo](https://github.com/MxNaruto/eMonitor-Plus/blob/master/frontends/galand-client/src/assests/default-logo4.png)

eMonitor+ is designed to monitor digital media platforms using AI and carry out big data analysis to identify misinformation, hate speech, violence against women, electoral campaign violations, political pluralism and polarization, spending on electoral campaign ads, perception and sentiment towards elections, among others. The platform works in four languages, Arabic, English and French, and Spanish and relies on machine learning to track and analyze the content on digital media during elections to generate graphical representations for data visualization and reports.

## **Technical Overview** 

---


## **Components** 

----

## **Our five phases approach**
<B>Phase I:</B> The methodology of eMonitor+ is driven based on a bottom-up approach that includes forming the core team at the local level and working together to define the scope of the project and the areas of support and topics to be tracked.
 

<B>Phase II:</B> eMonitor+ methodology will be adapted and customized to the local context based on the country's legal framework, including laws related to elections, defining the main political actors, media outlets, influencers, and accounts to follow. In addition, developing the M&E framework and the risk and mitigation analysis.
 

<B>Phase III:</B> Increasing knowledge and skills and building capacity of the core team on the theoretical and practical approaches to digital media monitoring, combating mis/disinformation and hate speech, and prevention of violence against women online.
 

<B>Phase IV:</B> Tracking, collecting and analyzing data to be analyzed by the monitors manually and the platform's algorithms automatically. The data analysis is then visualized on a customized dashboard.
 

<B>Phase V:</B> Developing policies and recommendations driven by data and analytics, including developing a sustainability strategy at the national level and creating an environment where information is always collected and exchanged to inform policymaking.

![Our five phases](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/5_phase.png)


## **Presentation**

I.	Dashboard 
The Monitor's main user interface shows:
1.	My posts: a library containing the newsgroup processed by the user,
2.	Assigned Fake News: A library of the newsgroup that the user has been designated to process,
3.	Posts Infractions (Publication of violations): a library that includes the news that has been processed, with the detection of a violation.
4.	Monitoring Infractions: This library contains the set of violations that have been added, pending approval,

![1](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/1.png)


The main control interface also displays:
5.	Recently added news: a library that displays all the newly added news,
6.	The latest monitoring violations: a library that includes a list of news through which violations were monitored and reported,




II.	Create a new post
a.	From Scraping (automatic analyzes)
![2](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/2.png)

In this interface, the monitor can consult all the articles collected and analyzed by the 'scraping', by clicking on the "List of Articles" button in the side menu of the home interface,
Scraping technology is an automated process of extracting and collecting data from websites and/or social media platforms using computer programs. This process is typically set up by the technical supervisor, who configures the program to monitor specific websites and/or social media channels on a regular basis, to extract later, relevant data according to predetermined parameters (identify irregularities, mis/disinformation, hate speech, cyber violence against the minorities, etc.)
![3](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/3.png)  

The monitors can define specific search criteria to narrow down the data collection process. 
 
These criteria include: 
1.	The source platform (e.g., website, social media channel), 
2.	The data source (e.g., a specific Twitter or Facebook page), 
3.	The time frame for collecting and monitoring the data. 
4.	It is also possible to set up keyword searches to facilitate the data collection process,
5.	Additionally, observers can set up custom searches and save them for further use,
6.	After the data is collected, the administrator can download it in the form of an Excel table for further analysis,

	Automatic analysis for hate speech and cyberviolence detection
The platform uses an automatic analysis process, based on artificial intelligence to detect instances of hate speech and cyber violence. This process is carried out according to specific parameters set by the technical administrator,
![4](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/4.png) 

The automated analysis of the article results in the detection of hate speech or violence against women or minorities in general.
![5](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/5.png) 
 
 
 
The analysis process also classifies the speech as 'normal', 'offensive', 'abusive', or 'hateful', depending on the severity of the language used. 
It can also detect and classify specific types of speech, such as 'insults' which are verbal attacks, 'toxicity' which refers to harmful or negative language, 'threats' which involve expressing an intent to harm someone or something, 'identity attacks' which involve targeted attacks on someone's personal characteristics, and 'profanity' which refers to the use of vulgar or offensive language.
 
![6](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/6.png)
 
Based on the results of the automated analysis, the monitor has the option to either generate a new post or abstain,
![7](https://github.com/MxNaruto/eMonitor-Plus/blob/master/images/7.png) 

The form is pre-populated by default, and the monitor will complete the remaining fields, or update existing ones, if necessary,
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

The platform is founded on the efforts of UNDP Tunisia's electoral assistance project, which has designed and operated the platform since 2019. UNDP Regional Electoral Support project for the MENA region is scaling up the platform globally.   



