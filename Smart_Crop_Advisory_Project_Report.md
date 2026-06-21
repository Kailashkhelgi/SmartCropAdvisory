# SMART CROP ADVISORY SYSTEM
## AI-Powered Multilingual Agricultural Advisory Platform

---

**A Project Report**

Submitted by

**[Your Name]**  
**[USN/Roll Number]**

in partial fulfillment for the award of the degree of

**BACHELOR OF TECHNOLOGY**  
in  
**COMPUTER SCIENCE AND ENGINEERING**

---

**Department of Computer Science and Engineering**  
**Faculty of Engineering and Technology [Co-Ed]**  
**Sharnbasva University**  
**Kalaburagi-585 103, Karnataka, India**

**June 2026**

---

## CERTIFICATE

This is to certify that the project work entitled **"Smart Crop Advisory System"** submitted by **[Your Name]** (USN: [Your USN]) in partial fulfillment for the award of the degree of Bachelor of Technology in Computer Science and Engineering to Sharnbasva University, Kalaburagi during the academic year 2025-2026, is a record of bonafide work carried out by him/her under my guidance and supervision.

The results embodied in this project report have not been submitted to any other university or institution for the award of any degree or diploma.



**Signature of Guide**  
[Guide Name]  
Assistant Professor  
Department of Computer Science and Engineering

**Signature of HOD**  
Dr. [HOD Name]  
Professor and Head  
Department of Computer Science and Engineering

**Date:** _______________  
**Place:** Kalaburagi

---

## DECLARATION

I, **[Your Name]**, student of Bachelor of Technology in Computer Science and Engineering, Sharnbasva University, Kalaburagi, hereby declare that the project work entitled **"Smart Crop Advisory System"** submitted in partial fulfillment for the award of the degree of Bachelor of Technology is a result of my own work and efforts.

I further declare that this project work has not been submitted to any other university or institution for the award of any degree or diploma.

**Signature of Student**  
[Your Name]  
USN: [Your USN]

**Date:** _______________  
**Place:** Kalaburagi

---

## ACKNOWLEDGEMENT

I would like to express my sincere gratitude to all those who have contributed to the successful completion of this project.

First and foremost, I am deeply grateful to my project guide, **[Guide Name]**, Assistant Professor, Department of Computer Science and Engineering, for their invaluable guidance, continuous encouragement, and expert advice throughout the project work. Their insights and suggestions have been instrumental in shaping this project.

I extend my heartfelt thanks to **Dr. [HOD Name]**, Professor and Head, Department of Computer Science and Engineering, for providing the necessary facilities and support for carrying out this project.

I am thankful to **[Project Coordinator Name]**, Project Coordinator, for their administrative support and coordination throughout the project phase.

I would like to acknowledge the **Government of Punjab, Department of Higher Education**, for promoting this project under the Agriculture, FoodTech & Rural Development theme, which addresses critical challenges faced by small and marginal farmers in India.

My sincere thanks to the faculty members of the Department of Computer Science and Engineering for their support and encouragement.

I am grateful to my family and friends for their constant support and motivation throughout my academic journey.

Finally, I thank the Almighty for blessing me with the strength and perseverance to complete this project successfully.

**[Your Name]**  
USN: [Your USN]

---

## ABSTRACT

The Smart Crop Advisory System is a multilingual, AI-powered mobile and web application designed to bridge the agricultural knowledge gap for small and marginal farmers in India. The system provides real-time, location-specific guidance on crop selection, soil health management, fertilizer recommendations, pest and disease detection, weather alerts, and market price information.

Agriculture remains the backbone of the Indian economy, with over 60% of the population depending on it for their livelihood. However, small and marginal farmers often lack access to expert agricultural knowledge and rely on guesswork or recommendations from local shopkeepers for critical decisions regarding crop selection, fertilizer application, and pest management. This leads to suboptimal yields, increased input costs, crop losses, and reduced farmer income.

The Smart Crop Advisory System addresses these challenges by integrating artificial intelligence, machine learning, computer vision, and multilingual voice interfaces into a unified platform. The system employs a microservices architecture with separate frontend (React web and React Native mobile applications) and backend (Node.js/Express API) services, backed by PostgreSQL database and Redis cache. AI/ML engines built with Python FastAPI provide crop recommendations and pest detection capabilities.

Key features include: (1) OTP-based farmer registration with multilingual profile management in English, Hindi, and Punjabi; (2) Soil profile input with validation and GPS-based plot tracking; (3) AI-generated crop recommendations considering soil properties, location, season, and crop rotation principles; (4) Crop-specific fertilizer schedules with organic alternatives and soil amendments; (5) Computer vision-based pest and disease detection through image analysis; (6) Real-time weather alerts with 12-hour advance warnings for adverse conditions; (7) Market price tracking from multiple agricultural markets (mandis) within 100 km; (8) Voice-based interaction using speech-to-text and text-to-speech for low-literate farmers; and (9) Feedback collection and analytics dashboard for continuous improvement.

The system architecture follows layered design principles with API Gateway for authentication and request routing, application services for business logic, AI/ML tier for recommendations and analysis, and data tier with PostgreSQL for persistent storage and Redis for caching. All API keys and secrets are managed via environment variables to ensure security compliance.

Testing strategy includes both unit tests and property-based tests to ensure correctness across all system components. The platform demonstrates scalability, extensibility, and privacy-compliant data handling with anonymized analytics.

**Keywords:** Smart Agriculture, Crop Advisory, AI/ML, Computer Vision, Multilingual Interface, Voice Recognition, Weather Alerts, Market Prices, Microservices Architecture, Digital Farming

---

## TABLE OF CONTENTS

| Chapter | Title | Page |
|---------|-------|------|
| | **Certificate** | ii |
| | **Declaration** | iii |
| | **Acknowledgement** | iv |
| | **Abstract** | v |
| | **Table of Contents** | vi |
| | **List of Figures** | viii |
| | **List of Tables** | ix |
| | **List of Abbreviations** | x |
| **1** | **INTRODUCTION** | 1 |
| | 1.1 Project Overview | 1 |
| | 1.2 Motivation | 2 |
| | 1.3 Problem Statement | 3 |
| | 1.4 Objectives | 4 |
| | 1.5 Scope of the Project | 5 |
| | 1.6 Organization of the Report | 6 |
| **2** | **LITERATURE SURVEY** | 7 |
| | 2.1 Introduction | 7 |
| | 2.2 Review of Existing Systems | 8 |
| | 2.3 Research Gap Analysis | 12 |
| | 2.4 Current Technology Trends | 13 |
| | 2.5 Summary | 15 |
| **3** | **SYSTEM REQUIREMENTS AND ANALYSIS** | 16 |
| | 3.1 Functional Requirements | 16 |
| | 3.2 Non-Functional Requirements | 21 |
| | 3.3 Hardware Requirements | 22 |
| | 3.4 Software Requirements | 23 |
| | 3.5 User Requirements | 24 |
| | 3.6 Feasibility Study | 25 |
| **4** | **SYSTEM DESIGN** | 27 |
| | 4.1 System Architecture | 27 |
| | 4.2 Technology Stack | 30 |
| | 4.3 Database Design | 32 |
| | 4.4 API Design | 36 |
| | 4.5 User Interface Design | 38 |
| | 4.6 Security Design | 40 |
| **5** | **IMPLEMENTATION** | 42 |
| | 5.1 Development Environment Setup | 42 |
| | 5.2 Backend Implementation | 43 |
| | 5.3 Frontend Implementation | 47 |
| | 5.4 AI/ML Engine Implementation | 50 |
| | 5.5 Integration and Deployment | 53 |
| **6** | **TESTING AND VALIDATION** | 55 |
| | 6.1 Testing Strategy | 55 |
| | 6.2 Unit Testing | 56 |
| | 6.3 Property-Based Testing | 57 |
| | 6.4 Integration Testing | 58 |
| | 6.5 User Acceptance Testing | 59 |
| | 6.6 Test Results and Analysis | 60 |
| **7** | **RESULTS AND ANALYSIS** | 62 |
| | 7.1 System Performance | 62 |
| | 7.2 Feature-wise Analysis | 64 |
| | 7.3 User Feedback Analysis | 68 |
| | 7.4 Comparative Analysis | 69 |
| **8** | **CONCLUSION AND FUTURE SCOPE** | 71 |
| | 8.1 Conclusion | 71 |
| | 8.2 Achievements | 72 |
| | 8.3 Limitations | 73 |
| | 8.4 Future Scope | 74 |
| **9** | **REFERENCES** | 76 |
| **10** | **APPENDICES** | 78 |
| | Appendix A: Source Code Snippets | 78 |
| | Appendix B: Database Schema | 82 |
| | Appendix C: API Documentation | 84 |
| | Appendix D: User Manual | 86 |
| | Appendix E: Screenshots | 88 |

---

## LIST OF FIGURES

| Figure No. | Title | Page |
|------------|-------|------|
| 1.1 | Indian Agriculture Challenges | 2 |
| 2.1 | Comparison of Existing Agricultural Advisory Systems | 11 |
| 4.1 | System Architecture Diagram | 28 |
| 4.2 | Layered Architecture | 29 |
| 4.3 | Database Entity Relationship Diagram | 33 |
| 4.4 | Authentication Flow Diagram | 37 |
| 4.5 | Web Application User Interface | 39 |
| 4.6 | Mobile Application User Interface | 39 |
| 5.1 | Backend Service Architecture | 44 |
| 5.2 | Frontend Component Hierarchy | 48 |
| 5.3 | AI/ML Pipeline for Crop Recommendations | 51 |
| 5.4 | Computer Vision Pipeline for Pest Detection | 52 |
| 5.5 | Deployment Architecture | 54 |
| 6.1 | Testing Pyramid | 55 |
| 7.1 | System Response Time Analysis | 63 |
| 7.2 | Crop Recommendation Accuracy | 65 |
| 7.3 | Pest Detection Confidence Scores | 66 |
| 7.4 | User Adoption and Engagement Metrics | 68 |
| 7.5 | Feature Comparison with Existing Systems | 70 |

---

## LIST OF TABLES

| Table No. | Title | Page |
|-----------|-------|------|
| 1.1 | Project Objectives and Success Criteria | 4 |
| 2.1 | Existing Systems Feature Matrix | 10 |
| 2.2 | Technology Trends in Smart Agriculture | 14 |
| 3.1 | Functional Requirements Summary | 20 |
| 3.2 | Non-Functional Requirements | 21 |
| 3.3 | Hardware Requirements | 22 |
| 3.4 | Software Requirements | 23 |
| 4.1 | Technology Stack | 31 |
| 4.2 | Database Tables Overview | 35 |
| 4.3 | RESTful API Endpoints | 37 |
| 5.1 | Development Tools and Frameworks | 42 |
| 5.2 | Backend Service Modules | 46 |
| 5.3 | Frontend Pages and Components | 49 |
| 6.1 | Test Case Summary | 60 |
| 6.2 | Property-Based Test Results | 61 |
| 7.1 | Performance Metrics | 62 |
| 7.2 | Feature-wise User Satisfaction Ratings | 67 |

---

## LIST OF ABBREVIATIONS

| Abbreviation | Full Form |
|--------------|-----------|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| CPU | Central Processing Unit |
| CRUD | Create, Read, Update, Delete |
| CSS | Cascading Style Sheets |
| DB | Database |
| DBMS | Database Management System |
| ER | Entity Relationship |
| FCM | Firebase Cloud Messaging |
| GPS | Global Positioning System |
| HTML | HyperText Markup Language |
| HTTP | HyperText Transfer Protocol |
| HTTPS | HyperText Transfer Protocol Secure |
| IoT | Internet of Things |
| IT | Information Technology |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| KB | Kilobyte |
| HTTPS | HyperText Transfer Protocol Secure |
| MB | Megabyte |
| ML | Machine Learning |
| MVC | Model-View-Controller |
| NPK | Nitrogen, Phosphorus, Potassium |
| OTP | One-Time Password |
| PBT | Property-Based Testing |
| pH | Potential of Hydrogen |
| PNG | Portable Network Graphics |
| RAM | Random Access Memory |
| REST | Representational State Transfer |
| SMS | Short Message Service |
| SQL | Structured Query Language |
| STT | Speech-to-Text |
| TTL | Time To Live |
| TTS | Text-to-Speech |
| UI | User Interface |
| URL | Uniform Resource Locator |
| USN | University Seat Number |
| UUID | Universally Unique Identifier |
| UX | User Experience |
| XML | eXtensible Markup Language |

---

# CHAPTER 1
# INTRODUCTION

## 1.1 Project Overview

The Smart Crop Advisory System is an innovative technological solution designed to empower small and marginal farmers in India with access to expert agricultural knowledge through an AI-powered, multilingual mobile and web platform. This project, developed under the Government of Punjab's Department of Higher Education initiative in the Agriculture, FoodTech & Rural Development theme, addresses the critical gap between agricultural expertise and farmers who traditionally rely on guesswork or local shopkeeper advice for farming decisions.

The system integrates multiple cutting-edge technologies including artificial intelligence for crop recommendations, machine learning for predictive analytics, computer vision for pest and disease detection, natural language processing for multilingual support, and voice recognition for accessibility. The platform provides comprehensive advisory services covering crop selection, soil health management, fertilizer recommendations, weather-based alerts, market price information, and pest management—all tailored to the farmer's specific location, soil conditions, and preferences.

Built on modern software engineering principles, the system follows a microservices architecture that ensures scalability, maintainability, and independent deployment of components. The backend is developed using Node.js and Express, with PostgreSQL for persistent data storage and Redis for caching. The frontend comprises a React-based web application and a React Native mobile application, ensuring accessibility across devices. Specialized Python-based FastAPI microservices handle AI/ML workloads including crop advisory algorithms and image analysis for pest detection.

The system supports three major Indian languages—English, Hindi, and Punjabi—making it accessible to farmers with varying literacy levels. Voice-based interaction using speech-to-text (STT) and text-to-speech (TTS) technologies further enhances accessibility for low-literate farmers who may face challenges with text-based interfaces.

Security and privacy are core considerations in the system design. All sensitive credentials are managed through environment variables and excluded from version control. Farmer data is anonymized for analytics purposes while maintaining strict compliance with data protection requirements. JWT-based authentication ensures secure access to the platform.

The project aligns with national initiatives such as Digital India and aims to contribute to improved agricultural productivity, reduced input costs, minimized crop losses, better market access, and ultimately enhanced farmer income. By democratizing access to agricultural expertise through technology, the Smart Crop Advisory System represents a significant step toward bridging the digital divide in rural India.

---

## 1.2 Motivation

Agriculture is the backbone of the Indian economy, directly employing over 60% of the population and contributing approximately 17-18% to the country's GDP. Despite its critical importance, the sector faces numerous challenges that significantly impact the livelihoods of millions of small and marginal farmers who constitute over 86% of India's farming community.

### 1.2.1 Agricultural Challenges in India

**Knowledge Gap**: The majority of small and marginal farmers lack access to expert agricultural advice. Extension services, while present, cannot reach every farmer with personalized, timely guidance. Farmers often rely on traditional practices, local shopkeepers, or neighboring farmers for advice, which may not be scientifically accurate or suitable for their specific conditions.

**Suboptimal Crop Selection**: Without proper advisory services, farmers frequently choose crops based on prevailing market trends or tradition rather than scientific analysis of soil conditions, climatic suitability, and water availability. This leads to reduced yields and increased risk of crop failure.

**Fertilizer Mismanagement**: Over-application or improper timing of fertilizers is common due to lack of soil testing and expert guidance. This not only increases input costs but also degrades soil health and environmental quality. Farmers spend up to 30-40% of their cultivation costs on fertilizers without understanding optimal application strategies.

**Pest and Disease Management**: Early detection and proper identification of pests and diseases are critical for minimizing crop losses. However, farmers often identify problems too late or apply incorrect treatments, leading to significant yield losses estimated at 15-25% annually.

**Weather Uncertainty**: Climate variability and extreme weather events have increased in frequency. Farmers need timely weather alerts and advisory on protective measures, but lack access to localized, actionable weather information.

**Market Information Asymmetry**: Farmers frequently sell their produce at suboptimal prices due to lack of information about prevailing market rates at different agricultural markets (mandis). Middlemen exploit this information gap, reducing farmer income by 20-30%.

**Language and Literacy Barriers**: Many existing digital solutions are available only in English and require text-based interaction, making them inaccessible to farmers with limited literacy or who prefer their local language.

### 1.2.2 Technological Opportunity

Recent advances in artificial intelligence, machine learning, computer vision, and mobile technology present unprecedented opportunities to address these challenges at scale. The widespread availability of affordable smartphones, even in rural areas, combined with improving internet connectivity, creates a feasible pathway for technology-led agricultural transformation.

### 1.2.3 Government Policy Alignment

The project aligns with several national and state-level initiatives including Digital India, Pradhan Mantri Kisan Samman Nidhi (PM-KISAN), National Mission for Sustainable Agriculture (NMSA), and the Government of Punjab's focus on agricultural modernization. These initiatives emphasize technology adoption to improve agricultural productivity and farmer welfare.

### 1.2.4 Social Impact

By democratizing access to agricultural expertise, the Smart Crop Advisory System has the potential to significantly improve the quality of life for millions of farming families. Better crop yields, reduced input costs, minimized losses, and improved market access directly translate to enhanced farmer income and financial security. The system also promotes sustainable agricultural practices through recommendations for organic alternatives and soil health management.

### 1.2.5 Personal Motivation

As computer science students in an agricultural state, we witnessed firsthand the challenges faced by farming communities. The opportunity to apply our technical skills to solve real-world problems affecting millions of people provided strong motivation to undertake this project. The potential to contribute meaningfully to agricultural development through innovative technology application made this project both purposeful and fulfilling.

---

## 1.3 Problem Statement

Despite agriculture being the primary occupation for a majority of Indians, small and marginal farmers face significant challenges in accessing timely, accurate, and personalized agricultural advisory services. These challenges manifest in multiple dimensions:

**1. Limited Access to Expert Knowledge**: Agricultural extension services cannot provide personalized, real-time guidance to every farmer. The extension worker-to-farmer ratio in India is approximately 1:1000, making individual consultations impractical. Farmers resort to advice from local shopkeepers who may have commercial interests in selling specific products, leading to suboptimal recommendations.

**2. Lack of Data-Driven Decision Making**: Most farming decisions are based on traditional practices or anecdotal evidence rather than scientific analysis of soil properties, weather patterns, crop suitability, and market dynamics. Soil testing facilities are limited and expensive, resulting in blanket fertilizer application without understanding actual nutrient requirements.

**3. Delayed Pest and Disease Detection**: Farmers typically identify pest infestations or crop diseases when visible damage has already occurred. By this time, treatment effectiveness is reduced, and yield losses are inevitable. Expert identification of pests and diseases requires knowledge that most farmers do not possess.

**4. Weather-Related Crop Losses**: Extreme weather events such as unseasonal rainfall, hailstorms, frost, and heatwaves cause significant crop losses. Farmers lack access to hyperlocal weather forecasts and actionable advisory on protective measures they should take in advance.

**5. Market Price Information Gap**: Farmers sell their produce at prevailing rates in nearby mandis without knowledge of prices at other markets. This information asymmetry is exploited by middlemen, resulting in farmers receiving 20-30% lower prices than the maximum available rate.

**6. Language and Literacy Barriers**: Existing digital agricultural advisory platforms are predominantly in English and require text-based interaction. According to the 2011 Census, the rural literacy rate in India is around 68%, with significant variations across states. Even literate farmers may prefer voice-based interaction in their local language rather than reading text in English.

**7. Fragmented Information Sources**: Farmers need to access multiple sources for different types of information—weather from one source, market prices from another, and agricultural advice from yet another. This fragmentation makes it cumbersome to get comprehensive guidance in one place.

**8. Lack of Feedback Mechanisms**: Existing advisory systems do not systematically collect feedback on the effectiveness of recommendations, making it difficult to improve advice quality over time. There is no mechanism to learn from farmer experiences and incorporate insights into future recommendations.

**Problem Statement**: *There is a need for an integrated, AI-powered, multilingual agricultural advisory platform that provides small and marginal farmers with real-time, personalized guidance on crop selection, soil health management, fertilizer application, pest and disease management, weather alerts, and market prices, accessible through both text and voice interfaces in regional languages, thereby enabling data-driven decision making and improving agricultural productivity and farmer income.*

---

## 1.4 Objectives

The primary goal of the Smart Crop Advisory System is to empower small and marginal farmers with accessible, personalized, and scientifically accurate agricultural guidance. The specific objectives of this project are:

### 1.4.1 Primary Objectives

**1. Develop an Integrated Agricultural Advisory Platform**
   - Create a unified platform that consolidates crop advisory, soil management, pest detection, weather alerts, and market information in a single application
   - Ensure seamless integration of multiple services through a well-designed API architecture

**2. Implement AI/ML-Based Crop Recommendation System**
   - Develop machine learning algorithms that analyze soil properties (type, pH, NPK levels), geographic location, climatic conditions, and historical crop data
   - Generate personalized crop recommendations with expected yield ranges, water requirements, and estimated input costs
   - Incorporate crop rotation principles to promote sustainable agricultural practices

**3. Create Computer Vision-Based Pest and Disease Detection**
   - Implement deep learning models for image analysis that can identify common pests and diseases affecting major crops
   - Provide confidence scores for diagnoses and recommend both chemical and organic treatment options
   - Enable early detection through mobile image capture and instant analysis

**4. Provide Real-Time Weather Alerts and Advisories**
   - Integrate with weather forecasting APIs to obtain hyperlocal weather data
   - Implement alert mechanisms for adverse weather conditions (heavy rainfall, frost, heatwaves)
   - Generate crop-stage-specific advisory based on weather patterns and farmer's current crop selection

**5. Enable Market Price Discovery**
   - Aggregate market price data from multiple agricultural markets (mandis) within a specified radius
   - Display comparative price information with market names, distances, and last update timestamps
   - Implement caching mechanisms to ensure price data availability even when external services are temporarily unavailable

**6. Ensure Multilingual and Voice-Based Accessibility**
   - Support at least three languages: English, Hindi, and Punjabi
   - Implement speech-to-text (STT) and text-to-speech (TTS) capabilities for voice-based interaction
   - Design user interfaces that accommodate low-literate users through intuitive icons and voice guidance

**7. Implement Soil Profile Management**
   - Enable farmers to create and maintain digital soil profiles for their plots with GPS-based location tracking
   - Provide soil health guidance and recommendations for soil amendments based on pH and nutrient levels
   - Generate fertilizer schedules tailored to specific crops and soil conditions

**8. Build Scalable and Secure Architecture**
   - Design a microservices-based architecture that allows independent scaling and deployment of components
   - Implement JWT-based authentication and authorization mechanisms
   - Ensure all sensitive credentials are managed through environment variables and never committed to version control
   - Anonymize farmer data for analytics while maintaining privacy compliance

**9. Establish Continuous Improvement Mechanisms**
   - Implement feedback collection system allowing farmers to rate the quality of advisory
   - Create analytics dashboard for aggregating usage patterns and feedback trends
   - Design data pipelines that enable iterative improvement of AI/ML models based on field outcomes

**10. Validate System Correctness Through Comprehensive Testing**
   - Develop unit tests for individual components and functions
   - Implement property-based tests to verify system behavior across random inputs
   - Conduct integration testing to ensure seamless interaction between system components
   - Perform user acceptance testing with representative farmer groups

### 1.4.2 Secondary Objectives

**1. Promote Sustainable Agricultural Practices**
   - Recommend organic alternatives alongside chemical fertilizers and pesticides
   - Encourage crop rotation through intelligent recommendation algorithms
   - Provide guidance on soil health improvement and water conservation

**2. Contribute to Digital Inclusion**
   - Make advanced agricultural technology accessible to farmers regardless of literacy level
   - Demonstrate the potential of voice-based interfaces for rural technology adoption
   - Bridge the digital divide in agricultural communities

**3. Create Extensible Platform Architecture**
   - Design system components that can be easily extended with new features
   - Enable integration with additional external services (insurance, credit, government schemes)
   - Provide well-documented APIs that third-party developers can build upon

**4. Generate Insights for Agricultural Policy**
   - Collect anonymized aggregate data on crop choices, soil conditions, and market trends
   - Provide analytics that can inform agricultural policy decisions and extension service priorities
   - Demonstrate data-driven approach to agricultural development

---

## 1.5 Scope of the Project

### 1.5.1 Geographic Scope

The primary geographic focus of the Smart Crop Advisory System is the state of Punjab, India. Punjab was chosen as the initial target region due to:
- High smartphone penetration in rural areas
- Relatively better internet connectivity infrastructure
- Diverse cropping patterns including both Kharif (monsoon) and Rabi (winter) crops
- Government support for agricultural technology initiatives
- Availability of local language (Punjabi) speakers for testing and validation

The system is designed with scalability in mind, allowing expansion to other states and regions across India with minimal modifications. The architecture supports addition of new languages, region-specific crop databases, and integration with state-specific agricultural market systems.

### 1.5.2 User Scope

**Primary Users**: Small and marginal farmers (land holdings less than 5 acres) who constitute over 86% of India's farming community

**Secondary Users**: 
- Agricultural extension officers who can use the analytics dashboard to understand farmer needs and advisory trends
- System administrators responsible for platform maintenance and monitoring
- Policy makers who can access aggregated insights for evidence-based decision making

### 1.5.3 Crop Scope

The system initially covers major crops grown in Punjab across three cropping seasons:

**Kharif (Monsoon) Crops**: Rice (Paddy), Maize, Cotton, Sugarcane, Pulses (Moong, Urad)

**Rabi (Winter) Crops**: Wheat, Barley, Mustard, Chickpea (Chana), Potato

**Zaid (Summer) Crops**: Vegetables (Tomato, Cucumber, Bitter Gourd), Fodder crops

The crop database and recommendation algorithms can be extended to include additional crops as needed.

### 1.5.4 Feature Scope

**In-Scope Features**:
1. Farmer registration with OTP-based mobile verification
2. Multi-language support (English, Hindi, Punjabi)
3. Soil profile creation and management with GPS-based plot tracking
4. AI-powered crop recommendations based on soil, location, and season
5. Crop-specific fertilizer schedules with organic alternatives
6. Image-based pest and disease detection with treatment recommendations
7. Real-time weather alerts and crop-stage advisories
8. Market price information from multiple mandis within 100 km radius
9. Voice-based interaction (speech-to-text and text-to-speech)
10. Feedback collection and analytics dashboard
11. JWT-based authentication and authorization
12. Responsive web application and cross-platform mobile application

**Out-of-Scope Features** (Potential Future Enhancements):
1. Integration with government subsidy and insurance schemes
2. Direct marketplace for buying agricultural inputs
3. Peer-to-peer farmer community forums
4. IoT sensor integration for real-time soil and weather monitoring
5. Satellite imagery analysis for crop health monitoring
6. Financial advisory and credit facilitation services
7. Supply chain management and logistics support
8. Integration with agricultural machinery rental platforms

### 1.5.5 Technical Scope

**Architecture**: Microservices-based architecture with independent frontend and backend services

**Backend**: Node.js with Express framework, PostgreSQL database, Redis cache, Python FastAPI microservices for AI/ML workloads

**Frontend**: React-based web application with Vite, React Native mobile application for Android and iOS

**AI/ML**: Custom crop recommendation algorithms, computer vision models for pest detection, natural language processing for voice interfaces

**External Integrations**: OpenWeatherMap API for weather data, Agmarknet API for market prices, Google Cloud Speech API for voice recognition, Firebase Cloud Messaging for push notifications

**Security**: Environment-based configuration management, JWT authentication, API rate limiting, data anonymization for analytics

**Testing**: Unit tests, property-based tests (fast-check), integration tests, user acceptance tests

**Deployment**: Docker containerization, Docker Compose for development, deployment readiness for cloud platforms (AWS, Azure, GCP) or Kubernetes

### 1.5.6 Timeline Scope

The project was conceptualized, designed, implemented, and tested over the course of one academic year (VIII semester, 2025-2026) as part of the Bachelor of Technology curriculum. The timeline includes:
- Requirements gathering and analysis: 4 weeks
- System design and architecture: 4 weeks
- Implementation phase: 12 weeks
- Testing and validation: 3 weeks
- Documentation and presentation preparation: 3 weeks

### 1.5.7 Limitations

1. **Language Support**: Limited to three languages initially (English, Hindi, Punjabi)
2. **Crop Coverage**: Covers major crops but not all varieties and regional specialties
3. **Pest Detection**: Trained on common pests/diseases; may have lower accuracy for rare conditions
4. **Market Price Accuracy**: Dependent on external API availability and data freshness
5. **Internet Connectivity**: Requires internet connection for most features; limited offline capability
6. **Training Data**: AI/ML models trained on available datasets; accuracy improves with more diverse field data
7. **Real-world Validation**: Limited field testing duration; long-term effectiveness requires multi-season validation

---

## 1.6 Organization of the Report

This project report is organized into ten chapters, each focusing on specific aspects of the Smart Crop Advisory System development process.

**Chapter 1: Introduction** provides an overview of the project, including motivation, problem statement, objectives, and scope. It establishes the context and significance of the project in addressing agricultural challenges faced by small and marginal farmers in India.

**Chapter 2: Literature Survey** reviews existing agricultural advisory systems, academic research, and technology trends relevant to smart agriculture. It identifies the research gap that this project addresses and provides comparative analysis of similar systems.

**Chapter 3: System Requirements and Analysis** details the functional and non-functional requirements of the system. It describes hardware and software requirements, user requirements, and presents a feasibility study covering technical, operational, and economic aspects.

**Chapter 4: System Design** presents the architectural design of the Smart Crop Advisory System. It explains the technology stack, database schema, API design, user interface design, and security mechanisms. This chapter includes architecture diagrams, entity-relationship diagrams, and interface mockups.

**Chapter 5: Implementation** describes the actual development process, including environment setup, backend implementation, frontend implementation, AI/ML engine development, and integration procedures. It provides insights into coding practices, frameworks used, and implementation challenges encountered.

**Chapter 6: Testing and Validation** covers the testing strategy, including unit testing, property-based testing, integration testing, and user acceptance testing. It presents test case design, execution results, and analysis of system correctness and performance.

**Chapter 7: Results and Analysis** presents the outcomes of the project, including system performance metrics, feature-wise analysis, user feedback analysis, and comparative analysis with existing systems. It demonstrates the effectiveness of the Smart Crop Advisory System in meeting its objectives.

**Chapter 8: Conclusion and Future Scope** summarizes the project achievements, discusses limitations, and outlines potential future enhancements. It reflects on lessons learned and the broader impact potential of the system.

**Chapter 9: References** lists all academic papers, books, online resources, and documentation referenced during the project development and report preparation.

**Chapter 10: Appendices** includes supplementary materials such as source code snippets, complete database schema, API documentation, user manual, and system screenshots demonstrating key features.

This structured organization allows readers to progressively understand the project from conceptualization through implementation to evaluation, providing comprehensive documentation of all aspects of the Smart Crop Advisory System.

---

# CHAPTER 2
# LITERATURE SURVEY

## 2.1 Introduction

A comprehensive literature survey is essential to understand the current state of agricultural advisory systems, identify technological trends, and recognize research gaps. This chapter reviews existing systems, academic research, and technology applications in precision agriculture and farmer advisory services. The survey covers both government-led initiatives and commercial solutions, analyzing their features, strengths, and limitations. This analysis provides the foundation for understanding how the Smart Crop Advisory System addresses unmet needs in the agricultural advisory domain.

## 2.2 Review of Existing Systems

### 2.2.1 mKisan Portal

The mKisan Portal is a Government of India initiative under the Ministry of Agriculture and Farmers Welfare. Launched in 2013, it aims to deliver agricultural information to farmers through SMS and voice messages.

**Features**:
- SMS-based dissemination of agricultural advisories
- Weather alerts sent via text messages
- Market price information for selected crops
- Information on new agricultural schemes and policies
- Multi-language support (22 Indian languages)

**Limitations**:
- No personalization based on individual farmer's soil conditions or land holdings
- One-way communication with no mechanism for farmers to ask follow-up questions
- Limited to text/voice messages; no rich multimedia content or interactive features
- No AI-based recommendations; advisories are generic and broadcast-style
- Requires manual registration through agricultural extension offices
- No pest/disease identification capability

**Reference**: Ministry of Agriculture & Farmers Welfare, Government of India. (2013). mKisan Portal. Available at: https://mkisan.gov.in


### 2.2.2 Kisan Suvidha

Kisan Suvidha is a mobile application developed by the Government of India to provide farmers with comprehensive information related to agriculture.

**Features**:
- Weather forecasts for farmer's location
- Market prices from nearby mandis
- Information on agricultural inputs (seeds, fertilizers)
- Disease and pest management tips
- Agro-advisories
- Contact information for dealers, soil testing labs, and cold storages

**Limitations**:
- No personalized crop recommendations based on soil analysis
- Weather and market data are informational only; no actionable alerts
- Pest management advice is generic text; no image-based identification
- Primarily text-based interface with limited support for low-literate users
- No voice interaction capability
- Does not integrate real-time soil data or provide fertilizer schedules
- Limited AI/ML capabilities

**Reference**: Department of Agriculture, Cooperation & Farmers Welfare. (2016). Kisan Suvidha Mobile App. Available on Google Play Store and Apple App Store.

### 2.2.3 Plantix

Plantix is a commercial mobile application developed by PEAT GmbH (Germany) that uses AI and computer vision for crop disease detection.

**Features**:
- Image-based identification of crop diseases, pests, and nutrient deficiencies
- Library of over 500 crop damage patterns
- Treatment recommendations for identified issues
- Community forum where farmers can share experiences
- Multi-language support including English and Hindi
- Offline diagnostic capability (limited)

**Limitations**:
- Focused primarily on pest/disease identification; no comprehensive crop advisory
- No soil profile management or fertilizer scheduling
- Does not provide weather alerts or market price information
- No integration with location-specific crop recommendations
- Requires good-quality images for accurate identification
- Limited coverage of regional crop varieties
- Community forum quality depends on user participation

**Reference**: PEAT GmbH. (2015). Plantix - Your crop doctor. Available at: https://plantix.net


### 2.2.4 eNAM (National Agriculture Market)

eNAM is an online trading platform for agricultural commodities launched by the Government of India to create a unified national market.

**Features**:
- Real-time price information from participating mandis across India
- Online trading platform for agricultural produce
- Quality assurance through certified testing labs
- Payment and settlement through banks
- Warehouse receipts system

**Limitations**:
- Primarily focused on post-harvest marketing; no pre-harvest advisory
- Requires significant infrastructure (computer labs) at mandi level
- Limited direct farmer participation; mostly used by traders and FPOs
- No crop selection guidance or fertilizer recommendations
- No pest management or weather advisory features
- Requires literacy and digital skills to operate

**Reference**: Small Farmers Agribusiness Consortium (SFAC), Ministry of Agriculture & Farmers Welfare. (2016). e-National Agriculture Market. Available at: https://enam.gov.in

### 2.2.5 Agri App

Agri App is a commercial mobile application that provides various agricultural services to farmers in India.

**Features**:
- Crop advisory based on location
- Weather forecasts
- Market price information
- Expert consultation (paid service)
- Agricultural news and articles
- Community Q&A forum

**Limitations**:
- Crop advisory is not AI-driven; relies on expert articles and general guidelines
- No personalized recommendations based on individual soil profiles
- Expert consultation requires payment, limiting accessibility
- No image-based pest detection
- No voice interface for low-literate farmers
- Limited integration with government databases

**Reference**: Agri App Development Pvt. Ltd. (2017). Agri App. Available on Google Play Store.


### 2.2.6 Crop Insurance Mobile Apps

Various crop insurance providers have developed mobile applications for farmers to purchase insurance and file claims.

**Features**:
- Crop insurance policy purchase
- Premium calculation
- Claim filing and tracking
- Weather data for claim verification
- SMS alerts on claim status

**Limitations**:
- Focused solely on insurance; no preventive agricultural advisory
- Does not help farmers avoid crop losses through better practices
- Reactive rather than proactive approach
- Complex terms and conditions difficult for farmers to understand
- Claim settlement often delayed

**Reference**: Agriculture Insurance Company of India (AIC), ICICI Lombard, HDFC ERGO, and other insurance providers' mobile applications.

### 2.2.7 Comparative Analysis Table

| System | Crop Advisory | Pest Detection | Weather Alerts | Market Prices | Multilingual | Voice Support | Personalized | AI/ML |
|--------|---------------|----------------|----------------|---------------|--------------|---------------|--------------|-------|
| mKisan Portal | Generic | No | SMS-based | Yes | Yes | No | No | No |
| Kisan Suvidha | Generic | Text-based | Display only | Yes | Partial | No | No | No |
| Plantix | No | AI-based | No | No | Yes | No | No | Yes |
| eNAM | No | No | No | Yes (focus) | Yes | No | No | No |
| Agri App | Article-based | No | Display only | Yes | Yes | No | No | No |
| Crop Insurance | No | No | Informational | No | Partial | No | No | No |
| **Smart Crop Advisory** | **AI-based** | **AI-based** | **Real-time** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |

*Table 2.1: Comparative Feature Matrix of Existing Agricultural Advisory Systems*

The comparative analysis clearly demonstrates that while several systems address individual aspects of agricultural advisory (pest detection, market prices, weather), no existing system provides a comprehensive, AI-powered, personalized, and voice-enabled solution that integrates all these features in a single platform.

---

## 2.3 Research Gap Analysis

Based on the comprehensive review of existing agricultural advisory systems, several critical gaps have been identified:

**1. Lack of Integrated Solution**: Existing systems address individual aspects (pest detection, market prices, weather) but no platform provides comprehensive, end-to-end agricultural advisory combining all these services in a unified interface.

**2. Absence of AI-Driven Personalization**: Most systems provide generic advisories without considering individual farmer's soil conditions, land characteristics, crop history, or local climatic variations. AI/ML-based personalization is largely missing.

**3. Limited Accessibility for Low-Literate Farmers**: Despite India's rural literacy challenges, most digital agricultural platforms require text-based interaction in English. Voice-based interfaces in regional languages are rare or non-existent.

**4. No Real-Time Decision Support**: Farmers need timely, actionable insights during critical farming stages (sowing, fertilizer application, pest outbreak). Existing systems provide delayed or generic information that may not be immediately actionable.

**5. Fragmented Data Sources**: Farmers must access multiple applications or services for different types of information, creating friction and reducing adoption. A single-window solution is needed.

**6. Lack of Feedback Mechanisms**: Existing systems do not systematically collect farmer feedback on advisory quality, making continuous improvement difficult. There is no data-driven approach to validate and enhance recommendation accuracy.

**7. Limited Soil Health Management**: While some systems mention soil testing, comprehensive soil profile management with GPS-based plot tracking and personalized fertilizer schedules is largely absent.

**8. Reactive Rather Than Proactive**: Most systems are reactive (e.g., crop insurance) rather than proactive (preventing losses through early detection and timely alerts).

The Smart Crop Advisory System is specifically designed to address these gaps by providing an integrated, AI-powered, personalized, voice-enabled, and proactive agricultural advisory platform.

---

## 2.4 Current Technology Trends

Several technological advancements are driving innovation in precision agriculture and smart farming:

### 2.4.1 Artificial Intelligence and Machine Learning

AI/ML algorithms are being increasingly applied to agricultural challenges:
- **Crop Yield Prediction**: Machine learning models analyze historical data, weather patterns, soil conditions, and farming practices to predict crop yields with increasing accuracy.
- **Disease Detection**: Convolutional Neural Networks (CNNs) trained on thousands of images can identify plant diseases with accuracy comparable to or exceeding expert agronomists.
- **Recommendation Systems**: Collaborative filtering and content-based algorithms provide personalized crop and input recommendations.
- **Natural Language Processing**: Chatbots and voice assistants help farmers access information through conversational interfaces.

### 2.4.2 Computer Vision and Image Processing

Computer vision technologies enable automated analysis of crop health:
- **Pest and Disease Identification**: Deep learning models (ResNet, VGG, EfficientNet) achieve high accuracy in identifying pests and diseases from smartphone images.
- **Weed Detection**: Image analysis helps distinguish crops from weeds, enabling precision herbicide application.
- **Maturity Assessment**: Computer vision determines optimal harvest time by analyzing crop color and texture.
- **Quality Grading**: Automated systems grade produce quality based on visual characteristics.

### 2.4.3 Internet of Things (IoT)

IoT sensors provide real-time monitoring of agricultural parameters:
- **Soil Sensors**: Monitor moisture, temperature, pH, and nutrient levels.
- **Weather Stations**: Provide hyperlocal weather data including temperature, humidity, rainfall, and wind speed.
- **Drone Technology**: UAVs equipped with multispectral cameras assess crop health across large areas.
- **Smart Irrigation**: Automated systems optimize water usage based on real-time soil moisture data.

### 2.4.4 Cloud Computing and Edge Computing

Cloud infrastructure enables scalable agricultural services:
- **Big Data Analytics**: Cloud platforms process vast amounts of agricultural data from multiple sources.
- **Model Training**: GPU-enabled cloud services facilitate training of complex deep learning models.
- **Edge Computing**: On-device processing reduces latency for real-time decision-making in areas with limited connectivity.

### 2.4.5 Mobile-First Applications

Smartphone penetration in rural India (over 300 million users) creates opportunities:
- **Progressive Web Apps**: Lightweight applications that work offline and consume less data.
- **Voice-Based Interfaces**: Speech recognition in regional languages makes technology accessible to low-literate users.
- **SMS and USSD Integration**: Fallback mechanisms for areas with limited data connectivity.

### 2.4.6 Blockchain for Supply Chain

Blockchain technology is being explored for agricultural supply chain management:
- **Traceability**: Track produce from farm to consumer, ensuring authenticity and quality.
- **Smart Contracts**: Automate payments and reduce middleman dependency.
- **Price Discovery**: Transparent pricing mechanisms benefiting farmers.

### 2.4.7 Geographic Information Systems (GIS)

GIS technologies enable spatial analysis:
- **Precision Farming**: Variable rate application of inputs based on spatial data.
- **Land Suitability Analysis**: Identify optimal crops for specific locations.
- **Crop Insurance**: Satellite-based crop monitoring for insurance claims.

**Table 2.2: Technology Trends in Smart Agriculture**

| Technology | Application | Impact |
|------------|-------------|---------|
| AI/ML | Crop recommendations, yield prediction | Increased accuracy, personalization |
| Computer Vision | Pest detection, quality grading | Early problem detection, reduced losses |
| IoT | Real-time monitoring | Data-driven decision making |
| Cloud Computing | Scalable services, big data analytics | Wider reach, faster processing |
| Mobile Apps | Farmer-facing services | Accessibility, convenience |
| Blockchain | Supply chain transparency | Fair pricing, trust |
| GIS | Spatial analysis | Precision farming |

The Smart Crop Advisory System leverages several of these trends—AI/ML for recommendations, computer vision for pest detection, cloud computing for scalability, and mobile-first approach for accessibility—to create a comprehensive solution.

---

## 2.5 Summary

The literature survey reveals a landscape of agricultural advisory systems that address specific aspects of farming but lack comprehensive integration. Government initiatives like mKisan Portal and Kisan Suvidha provide valuable information dissemination but lack AI-driven personalization and interactive capabilities. Commercial solutions like Plantix excel in specific domains (pest detection) but do not offer end-to-end advisory services.

Key findings include:
1. **Fragmentation**: Farmers must use multiple systems for different needs
2. **Generic Advice**: Lack of personalization based on individual farm characteristics
3. **Accessibility Barriers**: Limited support for low-literate farmers and regional languages
4. **Technology Gap**: Underutilization of AI/ML, computer vision, and voice interfaces
5. **Feedback Loop Absence**: No systematic mechanism for continuous improvement

The Smart Crop Advisory System addresses these limitations by providing an integrated platform that combines AI-powered crop recommendations, computer vision-based pest detection, real-time weather alerts, market price information, and voice-enabled interaction in regional languages—all personalized to individual farmer's soil conditions and location.

The technological trends analysis indicates that the timing is opportune for such a comprehensive solution. Smartphone penetration, cloud infrastructure availability, advances in AI/ML models, and government policy support create a favorable ecosystem for technology-led agricultural transformation.

This literature review establishes the need for and feasibility of the Smart Crop Advisory System, positioning it as a significant contribution to bridging the agricultural knowledge gap in India.

---

# CHAPTER 3
# SYSTEM REQUIREMENTS AND ANALYSIS

## 3.1 Functional Requirements

Functional requirements define what the system should do—the specific behaviors, functions, and services it must provide. The Smart Crop Advisory System's functional requirements are organized by major feature areas.

### 3.1.1 User Registration and Authentication

**FR1.1 Farmer Registration**
- System shall allow farmers to register using their mobile number
- System shall send OTP (One-Time Password) for mobile verification
- System shall accept OTP within 10-minute validity period
- System shall create farmer profile upon successful OTP verification
- System shall reject registration if mobile number is already registered

**FR1.2 Profile Management**
- System shall store farmer details: name, mobile, preferred language, village, district, state, land size
- System shall support three languages: English, Hindi, and Punjabi
- System shall allow farmers to update their profile information
- System shall persist updates and reflect them in subsequent advisory requests

**FR1.3 Authentication**
- System shall issue JWT (JSON Web Token) upon successful login
- Access token shall be valid for 1 hour
- Refresh token shall be valid for 30 days
- System shall validate JWT on every protected endpoint access
- System shall provide token refresh mechanism

### 3.1.2 Soil Profile Management

**FR2.1 Soil Profile Creation**
- System shall allow farmers to create soil profiles for their plots
- System shall accept: soil type, pH level (0-14), NPK (Nitrogen, Phosphorus, Potassium) values
- System shall validate pH range (0-14) and non-negative nutrient values
- System shall associate each profile with GPS coordinates or named location
- System shall support multiple soil profiles per farmer (multiple plots)

**FR2.2 Soil Profile Validation**
- System shall reject pH values outside 0-14 range
- System shall reject negative nutrient values
- System shall return descriptive error messages identifying invalid fields

**FR2.3 Soil Profile Updates**
- System shall allow farmers to update existing soil profiles
- System shall use updated values for subsequent advisory requests


### 3.1.3 Crop Advisory

**FR3.1 Crop Recommendations**
- System shall generate at least 3 crop recommendations per request
- Recommendations shall be based on: soil profile, location, current season, crop history
- Each recommendation shall include: expected yield range, water requirement, estimated input cost
- System shall rank recommendations by suitability score

**FR3.2 Crop Rotation**
- System shall factor crop rotation principles when farmer has existing crop history
- System shall avoid recommending same crop consecutively on same plot

**FR3.3 Data Completeness Check**
- System shall verify soil profile completeness before generating recommendations
- System shall prompt farmer to complete missing fields if profile incomplete

### 3.1.4 Fertilizer Guidance

**FR4.1 Fertilizer Schedule Generation**
- System shall generate fertilizer schedule for selected crop and soil profile
- Schedule shall specify: type, quantity (kg/acre or bags/acre), application timing
- System shall recommend organic alternatives where suitable

**FR4.2 Soil Amendments**
- System shall include soil amendment recommendations (lime/sulfur) when pH outside optimal range
- System shall specify amendment quantity and application method

**FR4.3 Prerequisite Validation**
- System shall require linked soil profile before providing fertilizer guidance
- System shall return error if soil profile not found

### 3.1.5 Weather Alerts and Advisories

**FR5.1 Heavy Rainfall Alerts**
- System shall send alert when rainfall forecast exceeds 50mm within 24 hours
- Alert shall include recommended protective actions

**FR5.2 Frost Warnings**
- System shall send frost alert at least 12 hours before predicted event
- Alert shall include protective measures

**FR5.3 Crop-Stage Advisories**
- System shall generate advisories based on current weather and farmer's active crop
- Advisories shall be stage-specific (sowing, irrigation, harvesting)

**FR5.4 Data Refresh**
- System shall retrieve weather data at intervals no greater than 6 hours
- System shall display last successful forecast with timestamp if service unavailable

### 3.1.6 Pest and Disease Detection

**FR6.1 Image Upload**
- System shall accept JPEG and PNG formats
- Maximum file size: 10 MB
- System shall return diagnosis within 10 seconds

**FR6.2 Diagnosis Output**
- System shall identify detected pest/disease with confidence level
- System shall include treatment recommendations (chemical and organic)
- System shall provide dosage and application method

**FR6.3 Low Confidence Handling**
- System shall indicate low confidence when below 60%
- System shall recommend consulting extension officer for low-confidence diagnoses

**FR6.4 File Validation**
- System shall reject invalid file formats with error message specifying accepted formats

### 3.1.7 Market Price Information

**FR7.1 Price Retrieval**
- System shall return prices from at least 3 mandis within 100 km
- System shall display: mandi name, distance, current min/max/modal price, last update timestamp

**FR7.2 Staleness Warning**
- System shall display warning when price data exceeds 24 hours old
- System shall show timestamp with all price data

**FR7.3 Cache Handling**
- System shall serve cached prices when external API unavailable
- System shall display unavailability notice with cached data
- System shall refresh price data at intervals no greater than 12 hours

### 3.1.8 Voice Interaction

**FR8.1 Speech-to-Text**
- System shall support voice input in English, Hindi, and Punjabi
- System shall return transcript of spoken input
- System shall offer text fallback if recognition fails

**FR8.2 Text-to-Speech**
- System shall convert text responses to speech in farmer's preferred language
- System shall return audio response within 5 seconds under normal conditions

**FR8.3 Mode Switching**
- System shall allow switching between voice and text modes anytime during session

### 3.1.9 Feedback and Analytics

**FR9.1 Feedback Collection**
- System shall present feedback prompt after advisory delivery
- Rating scale: 1-5
- System shall accept feedback dismissal without re-prompting

**FR9.2 Session Logging**
- System shall record: timestamp, anonymized farmer ID, input parameters, recommendation
- System shall link feedback to specific advisory session

**FR9.3 Analytics Dashboard**
- System shall provide aggregated usage and feedback reports
- Dashboard shall be accessible to extension officers and administrators

### 3.1.10 Security and Configuration

**FR10.1 Environment Configuration**
- System shall load all API keys from environment variables
- System shall terminate startup if required variables missing
- System shall log descriptive error identifying missing variable

**FR10.2 API Security**
- Frontend shall not embed any API keys
- All API responses shall follow consistent envelope structure: status, data, error fields

**Table 3.1: Functional Requirements Summary**

| Category | Number of Requirements | Priority |
|----------|----------------------|----------|
| Authentication | 5 | High |
| Soil Management | 5 | High |
| Crop Advisory | 3 | High |
| Fertilizer Guidance | 3 | High |
| Weather Alerts | 4 | High |
| Pest Detection | 4 | High |
| Market Prices | 3 | Medium |
| Voice Interaction | 3 | Medium |
| Feedback & Analytics | 3 | Medium |
| Security | 2 | High |
| **Total** | **35** | - |

---

## 3.2 Non-Functional Requirements

Non-functional requirements specify quality attributes and constraints the system must satisfy.

### 3.2.1 Performance Requirements

**NFR1.1 Response Time**
- Crop advisory generation: < 3 seconds
- Pest detection from image: < 10 seconds
- Weather data retrieval: < 2 seconds
- Market price queries: < 2 seconds
- Voice response: < 5 seconds under normal network conditions

**NFR1.2 Throughput**
- System shall handle minimum 1000 concurrent users
- System shall process minimum 100 advisory requests per minute

**NFR1.3 Scalability**
- System shall be horizontally scalable to handle increased load
- Database queries shall be optimized with appropriate indexes

### 3.2.2 Availability and Reliability

**NFR2.1 Uptime**
- System shall maintain 99% uptime (excluding planned maintenance)
- Planned maintenance windows shall be communicated 48 hours in advance

**NFR2.2 Fault Tolerance**
- System shall gracefully handle external API failures with cached data
- System shall log all errors for debugging
- System shall provide fallback mechanisms for critical services

### 3.2.3 Security Requirements

**NFR3.1 Authentication**
- All protected endpoints shall require valid JWT
- Passwords (if implemented) shall be hashed using bcrypt or argon2
- Session tokens shall expire after configured time period

**NFR3.2 Data Protection**
- All communication shall use HTTPS
- Sensitive data (OTPs, tokens) shall not be logged
- API keys shall never be committed to version control

**NFR3.3 Privacy**
- Farmer data shall be anonymized for analytics (SHA-256 hashing)
- System shall comply with data protection regulations
- Personal information shall not be shared with third parties without consent

### 3.2.4 Usability Requirements

**NFR4.1 User Interface**
- Web interface shall be responsive (mobile, tablet, desktop)
- Mobile app shall work on Android 8.0+ and iOS 13.0+
- UI shall use intuitive icons and clear labels

**NFR4.2 Accessibility**
- System shall support three languages: English, Hindi, Punjabi
- Voice interface shall be available for text-free interaction
- Font sizes shall be readable on small screens (minimum 14px)

**NFR4.3 Learning Curve**
- New farmers shall be able to complete registration within 5 minutes
- Key features shall be discoverable without training

### 3.2.5 Maintainability and Extensibility

**NFR5.1 Code Quality**
- Code shall follow consistent styling conventions (ESLint, Prettier)
- Functions shall have single responsibility
- Code shall be documented with comments for complex logic

**NFR5.2 Modularity**
- System shall follow microservices architecture
- Services shall communicate via well-defined APIs
- New features shall be addable without major refactoring

**NFR5.3 Testing**
- Unit test coverage shall exceed 70%
- All critical paths shall have integration tests
- Property-based tests shall verify system correctness

### 3.2.6 Compatibility Requirements

**NFR6.1 Browser Support**
- Web application shall work on Chrome, Firefox, Safari, Edge (last 2 versions)

**NFR6.2 Mobile Platforms**
- Android: Version 8.0 (Oreo) and above
- iOS: Version 13.0 and above

**NFR6.3 Database**
- PostgreSQL 15 or higher
- Redis 7 or higher

**Table 3.2: Non-Functional Requirements Summary**

| Category | Requirement | Target Value |
|----------|-------------|--------------|
| Performance | Response time (advisory) | < 3 seconds |
| Performance | Concurrent users | ≥ 1000 |
| Availability | System uptime | 99% |
| Security | Data encryption | HTTPS mandatory |
| Security | Authentication | JWT-based |
| Usability | Languages supported | 3 (EN, HI, PA) |
| Usability | Voice support | Yes |
| Maintainability | Test coverage | > 70% |
| Compatibility | Android version | 8.0+ |
| Compatibility | iOS version | 13.0+ |

---

## 3.3 Hardware Requirements

### 3.3.1 Development Environment

**Developer Workstation:**
- **Processor**: Intel Core i5 (8th gen) or AMD Ryzen 5 equivalent or higher
- **RAM**: Minimum 8 GB (16 GB recommended)
- **Storage**: 256 GB SSD with at least 50 GB free space
- **Display**: 1920x1080 resolution or higher
- **Network**: Broadband internet connection (minimum 10 Mbps)

**Testing Devices:**
- **Android Device**: Android 8.0+ for mobile app testing
- **iOS Device**: iPhone with iOS 13.0+ for mobile app testing
- **Smartphones**: Multiple devices with varying screen sizes for responsive testing

### 3.3.2 Server/Hosting Requirements

**Production Server (Cloud-based recommended):**
- **Processor**: 4 vCPUs or equivalent
- **RAM**: 16 GB
- **Storage**: 100 GB SSD
- **Network**: High-speed internet with low latency
- **Load Balancer**: For distributing traffic across multiple instances
- **Backup Storage**: Additional storage for database backups

**Database Server:**
- **Processor**: 2 vCPUs minimum
- **RAM**: 8 GB minimum
- **Storage**: 50 GB SSD with auto-scaling capability

**Redis Cache Server:**
- **Processor**: 2 vCPUs
- **RAM**: 4 GB
- **Storage**: 20 GB

### 3.3.3 End-User Requirements

**Farmer (Mobile):**
- **Device**: Android smartphone (8.0+) or iPhone (iOS 13.0+)
- **RAM**: Minimum 2 GB
- **Storage**: 100 MB free space for app
- **Camera**: Rear camera for pest/disease image capture
- **Network**: 3G/4G/WiFi connectivity

**Farmer (Web):**
- **Device**: Computer/Laptop or tablet
- **Browser**: Chrome, Firefox, Safari, or Edge (last 2 versions)
- **Network**: Broadband or mobile internet connection

**Extension Officer/Admin:**
- **Device**: Computer/Laptop with modern browser
- **Display**: Minimum 1366x768 resolution
- **Network**: Stable broadband connection

**Table 3.3: Hardware Requirements Summary**

| Component | Specification | Purpose |
|-----------|---------------|---------|
| Dev Workstation CPU | Core i5 8th gen+ | Development |
| Dev Workstation RAM | 16 GB | Development |
| Production Server CPU | 4 vCPUs | Hosting backend services |
| Production Server RAM | 16 GB | Running application services |
| Database Server RAM | 8 GB | PostgreSQL database |
| Cache Server RAM | 4 GB | Redis cache |
| Farmer Smartphone | Android 8.0+ / iOS 13.0+ | Mobile app access |
| Admin Workstation | Modern PC/Laptop | Dashboard access |

---

## 3.4 Software Requirements

### 3.4.1 Development Tools and Frameworks

**Backend Development:**
- **Runtime**: Node.js 20.x LTS
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Package Manager**: npm or yarn
- **API Documentation**: OpenAPI 3.1 (Swagger)
- **Code Quality**: ESLint, Prettier

**Frontend Web Development:**
- **Framework**: React 18.x
- **Build Tool**: Vite 5.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **State Management**: React Context API / Zustand
- **HTTP Client**: Axios

**Frontend Mobile Development:**
- **Framework**: React Native 0.72+
- **Platform**: Expo SDK 49+
- **Language**: TypeScript 5.x
- **Navigation**: React Navigation 6.x

**AI/ML Services:**
- **Language**: Python 3.10+
- **Framework**: FastAPI 0.100+
- **ML Libraries**: TensorFlow/PyTorch, scikit-learn, OpenCV
- **Image Processing**: Pillow, NumPy

### 3.4.2 Database and Caching

**Primary Database:**
- **DBMS**: PostgreSQL 15.x
- **ORM**: node-postgres (pg) or Prisma
- **Migration Tool**: db-migrate or Prisma Migrate

**Cache Layer:**
- **Cache Server**: Redis 7.x
- **Client**: ioredis (Node.js)

### 3.4.3 External APIs and Services

**Weather Data:**
- **Service**: OpenWeatherMap API
- **Plan**: Free tier or paid subscription
- **Documentation**: https://openweathermap.org/api

**Market Prices:**
- **Service**: Agmarknet API or equivalent
- **Alternative**: Custom aggregator from government data

**Speech Recognition:**
- **Service**: Google Cloud Speech-to-Text API
- **Languages**: English (en-IN), Hindi (hi-IN), Punjabi (pa-IN)

**Text-to-Speech:**
- **Service**: Google Cloud Text-to-Speech API
- **Voices**: Regional language support

**Push Notifications:**
- **Service**: Firebase Cloud Messaging (FCM)
- **Platform**: Android and iOS

**SMS/OTP:**
- **Service**: Twilio or MSG91
- **Features**: OTP generation and delivery

### 3.4.4 Development and Testing Tools

**Version Control:**
- **System**: Git
- **Platform**: GitHub / GitLab
- **Branching Strategy**: GitFlow

**Testing:**
- **Unit Testing**: Jest, Vitest
- **Property-Based Testing**: fast-check (TypeScript), Hypothesis (Python)
- **Integration Testing**: Supertest (API testing)
- **End-to-End Testing**: Cypress / Playwright
- **Mobile Testing**: Jest + React Native Testing Library

**Containerization:**
- **Platform**: Docker 24.x
- **Orchestration**: Docker Compose (development), Kubernetes (production optional)
- **Registry**: Docker Hub or private registry

**CI/CD:**
- **Platform**: GitHub Actions / GitLab CI / Jenkins
- **Stages**: Lint → Test → Build → Deploy

**Monitoring and Logging:**
- **Logging**: Winston (Node.js), Python logging
- **Monitoring**: Prometheus + Grafana (optional)
- **Error Tracking**: Sentry (optional)

### 3.4.5 IDE and Code Editors

**Recommended IDEs:**
- **Visual Studio Code**: Primary IDE for TypeScript/JavaScript development
- **PyCharm or VS Code with Python**: For Python AI/ML services
- **Android Studio**: For Android-specific debugging
- **Xcode**: For iOS-specific debugging (macOS only)

**VS Code Extensions:**
- ESLint, Prettier, TypeScript, Python, Docker, GitLens, Thunder Client

### 3.4.6 Operating Systems

**Development:**
- **Windows**: 10/11
- **macOS**: 12.0 (Monterey) or higher
- **Linux**: Ubuntu 20.04 LTS or higher

**Server:**
- **Linux**: Ubuntu Server 22.04 LTS or CentOS 8+
- **Container OS**: Alpine Linux (for Docker images)

**Table 3.4: Software Requirements Summary**

| Category | Software | Version | Purpose |
|----------|----------|---------|---------|
| Backend Runtime | Node.js | 20.x | Server-side execution |
| Backend Framework | Express.js | 4.x | REST API |
| Frontend Web | React + Vite | 18.x + 5.x | Web application |
| Frontend Mobile | React Native | 0.72+ | Mobile app |
| AI/ML | Python + FastAPI | 3.10+ | ML services |
| Database | PostgreSQL | 15.x | Data storage |
| Cache | Redis | 7.x | Caching layer |
| Testing | Jest, fast-check | Latest | Testing framework |
| Containerization | Docker | 24.x | Deployment |
| Version Control | Git | Latest | Source control |

---


## 3.5 User Requirements

### 3.5.1 Farmer Users

**Primary Users**: Small and marginal farmers (land holding < 5 acres) who:
- Need expert agricultural guidance but lack access to extension officers
- Want to make data-driven decisions about crop selection and input application
- Require real-time weather and market information
- May have limited literacy or prefer voice-based interaction

**Key User Needs**:
1. Simple registration process using familiar mobile number
2. Guidance in their preferred local language (Hindi, Punjabi, or English)
3. Clear, actionable recommendations without technical jargon
4. Quick response times (< 5 seconds for most operations)
5. Offline access to previously retrieved information
6. Minimal data usage for users with limited mobile data plans
7. Visual aids and voice support for low-literate users

### 3.5.2 Agricultural Extension Officers

**Secondary Users**: Government agricultural extension officers who:
- Monitor farmer adoption and usage patterns
- Identify common issues or knowledge gaps
- Supplement AI recommendations with human expertise
- Need aggregated insights for policy recommendations

**Key User Needs**:
1. Dashboard access showing usage statistics and feedback trends
2. Ability to view anonymized farmer queries and recommendations
3. Reports on crop selection patterns, soil health trends, and advisory effectiveness
4. Alerts for farmers needing human intervention (low-confidence diagnoses)
5. Export functionality for reports and data analysis

### 3.5.3 System Administrators

**Administrative Users**: IT staff responsible for:
- System maintenance and monitoring
- User account management
- Configuration updates
- Performance optimization
- Security audits

**Key User Needs**:
1. System health monitoring dashboard
2. Log access and error tracking
3. Database backup and recovery tools
4. API rate limiting configuration
5. Security audit reports
6. User authentication logs

---

## 3.6 Feasibility Study

### 3.6.1 Technical Feasibility

**Infrastructure Availability**: Cloud hosting platforms (AWS, Azure, GCP) provide all required services including compute, database, caching, and CDN. Docker containerization ensures consistent deployment across environments.

**Technology Maturity**: All selected technologies (Node.js, React, PostgreSQL, Redis, Python) are mature, well-documented, and widely used in production systems. Large community support ensures quick resolution of issues.

**AI/ML Capabilities**: Pre-trained computer vision models for crop disease detection are available and can be fine-tuned on Indian crop varieties. Rule-based and machine learning approaches for crop recommendations are well-established.

**API Availability**: OpenWeatherMap provides free-tier weather data. Agmarknet offers public market price data. Google Cloud provides Speech-to-Text and Text-to-Speech APIs with support for Indian languages.

**Development Skills**: The development team has knowledge of full-stack web development, mobile app development, and basic AI/ML. Additional skills can be acquired through online courses and documentation.

**Scalability**: Microservices architecture allows independent scaling of components based on load. Horizontal scaling is straightforward for stateless services. Database and cache layers can be scaled vertically or with read replicas.

**Conclusion**: The project is technically feasible with available technologies and infrastructure.

### 3.6.2 Operational Feasibility

**User Adoption**: Smartphone penetration in rural Punjab exceeds 60%. Government digital literacy campaigns have familiarized farmers with mobile apps. Voice support and multilingual interface lower adoption barriers.

**Internet Connectivity**: 4G coverage in Punjab is widespread. The system's caching mechanisms ensure continued operation during temporary connectivity loss.

**Maintenance**: Standard DevOps practices (CI/CD, automated testing, monitoring) ensure manageable maintenance overhead. Docker containerization simplifies updates and rollbacks.

**Data Sources**: Weather and market price APIs have established reliability. Backup data sources can be configured for critical services.

**User Training**: Simple, intuitive UI reduces training requirements. Video tutorials and in-app guidance provide onboarding support. Extension officers can facilitate initial adoption.

**Conclusion**: The system is operationally viable with manageable maintenance requirements and realistic user adoption expectations.

### 3.6.3 Economic Feasibility

**Development Costs**:
- **Personnel**: Academic project with student developers (no salary cost)
- **Development Tools**: Free and open-source software (Node.js, React, PostgreSQL, VS Code, Git)
- **Cloud Resources**: Free tiers sufficient for development and testing
- **Total Development Cost**: Minimal (< ₹10,000 for miscellaneous expenses)

**Operational Costs** (Estimated Annual for 10,000 active users):
- **Cloud Hosting**: ₹1,20,000 (₹10,000/month for compute, database, storage)
- **External APIs**:
  - Weather API: ₹24,000 (paid plan for higher request limits)
  - Speech APIs: ₹50,000 (based on usage volume)
  - SMS/OTP Provider: ₹30,000 (for authentication)
- **Domain and SSL**: ₹5,000
- **Total Annual Operational Cost**: ₹2,29,000

**Benefits** (Estimated Annual for 10,000 farmers):
- **Yield Improvement**: 10% increase → ₹20,000 additional income per farmer → ₹20 crore total
- **Input Cost Reduction**: 15% fertilizer savings → ₹3,000 saved per farmer → ₹3 crore total
- **Reduced Crop Losses**: Early pest detection saving 5% of crop value → ₹10,000 per farmer → ₹10 crore total
- **Better Market Prices**: 5% better pricing → ₹5,000 per farmer → ₹50 lakh total
- **Total Annual Benefits**: ₹33.5 crore

**Cost-Benefit Ratio**: ₹33.5 crore / ₹2.29 lakh = 1,463:1

**Return on Investment (ROI)**: Even if actual benefits are 1% of estimated (₹33.5 lakh), ROI is still positive (146%).

**Scalability Economics**: Per-user cost decreases with scale due to fixed infrastructure costs being distributed across more users.

**Funding Opportunities**: Government agricultural schemes, CSR funding from agricultural companies, grants from development organizations.

**Conclusion**: The project is economically viable with minimal upfront costs and significant potential benefits. Even conservative benefit estimates justify the operational costs.

### 3.6.4 Social Feasibility

**Social Impact**: Directly addresses farmer welfare by democratizing access to agricultural expertise. Particularly benefits marginalized farmers who lack connections to extension services.

**Language and Literacy**: Multilingual voice support makes the system accessible to low-literate farmers, promoting digital inclusion.

**Gender Inclusion**: Many women farmers will benefit from anonymous, judgment-free access to advisory services without having to visit male-dominated extension offices.

**Environmental Impact**: Promotes sustainable farming through organic alternatives, crop rotation, and optimized fertilizer use, contributing to long-term soil health.

**Government Alignment**: Aligns with Digital India, Skill India, and farmer welfare programs, increasing likelihood of government support and integration.

**Trust Building**: Transparent recommendations with explanations, organic alternatives, and feedback mechanisms build user trust over time.

**Community Acceptance**: Existing government digital initiatives (PM-KISAN, eNAM) have paved the way for farmer acceptance of technology-based solutions.

**Conclusion**: The project has strong social feasibility with potential for positive impact on farmer livelihoods, digital inclusion, and sustainable agriculture.

---

# CHAPTER 4
# SYSTEM DESIGN

## 4.1 System Architecture

The Smart Crop Advisory System follows a layered, microservices-based architecture that ensures separation of concerns, independent scalability, and maintainability. The system is designed as independently deployable services communicating through well-defined APIs.

### 4.1.1 Architectural Layers

The system architecture consists of five distinct layers:

**1. Client Tier (Presentation Layer)**

This layer comprises the user-facing applications:
- **Web Application**: Built with React 18 and Vite, providing responsive interface for desktop and tablet users
- **Mobile Application**: Developed using React Native with Expo, supporting Android 8.0+ and iOS 13.0+

Both applications consume the same backend API, ensuring consistency in functionality. The client tier handles user input validation, session management, and presentation logic.

**2. API Gateway Tier**

The API Gateway serves as the single entry point for all client requests. Built with Express.js, it handles:
- **Authentication**: JWT validation for all protected endpoints
- **Authorization**: Role-based access control (farmer, extension officer, admin)
- **Rate Limiting**: Prevents abuse and ensures fair resource allocation
- **Request Routing**: Forwards requests to appropriate backend services
- **CORS Management**: Handles cross-origin resource sharing for web clients
- **Request Logging**: Tracks all API calls for monitoring and debugging

**3. Application Services Tier**

This tier contains the business logic implemented as separate Node.js services:
- **User Service**: Farmer registration, profile management, authentication
- **Advisory Service**: Orchestrates crop and fertilizer recommendations
- **Image Service**: Handles image uploads and pest detection coordination
- **Weather Service**: Integrates with weather APIs and triggers alerts
- **Market Price Service**: Aggregates and caches market price data
- **Voice Service**: Coordinates speech-to-text and text-to-speech operations
- **Notification Service**: Manages push notifications via Firebase FCM
- **Feedback Service**: Collects ratings and generates analytics

Each service is independently deployable and communicates with others through internal APIs.

**4. AI/ML Tier**

Specialized Python-based microservices handle computationally intensive AI/ML workloads:
- **Advisory Engine**: Generates crop recommendations and fertilizer schedules using rule-based algorithms and ML models
- **Vision Engine**: Performs image analysis for pest and disease detection using deep learning models (CNN-based architectures)

These services expose internal REST APIs consumed by the Application Services tier. They are not directly accessible from the Client tier.

**5. Data Tier**

The data tier provides persistence and caching:
- **PostgreSQL 15**: Primary database storing farmer profiles, soil data, crop history, advisory sessions, feedback, and notifications
- **Redis 7**: In-memory cache storing OTPs, refresh tokens, weather data, market prices, and session data

### 4.1.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT TIER                            │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │  Web Application     │    │  Mobile Application  │      │
│  │  (React + Vite)      │    │  (React Native)      │      │
│  └──────────┬───────────┘    └───────────┬──────────┘      │
└─────────────┼──────────────────────────────┼────────────────┘
              │                              │
              └──────────────┬───────────────┘
                             │ HTTPS
              ┌──────────────▼────────────────┐
              │      API GATEWAY TIER         │
              │  ┌─────────────────────────┐  │
              │  │  Express API Gateway    │  │
              │  │  • JWT Validation       │  │
              │  │  • Rate Limiting        │  │
              │  │  • Request Routing      │  │
              │  └────────────┬────────────┘  │
              └───────────────┼────────────────┘
                              │
              ┌───────────────▼────────────────┐
              │   APPLICATION SERVICES TIER    │
              │  ┌──────┐  ┌──────┐  ┌──────┐ │
              │  │User  │  │Advis │  │Image │ │
              │  │Svc   │  │ory   │  │Svc   │ │
              │  └───┬──┘  └───┬──┘  └───┬──┘ │
              │  ┌───▼──┐  ┌───▼──┐  ┌───▼──┐ │
              │  │Wthr  │  │Market│  │Voice │ │
              │  │Svc   │  │Price │  │Svc   │ │
              │  └──────┘  └──────┘  └──────┘ │
              │  ┌──────┐  ┌─────────┐        │
              │  │Notify│  │Feedback │        │
              │  │Svc   │  │Svc      │        │
              │  └──────┘  └─────────┘        │
              └───────────────┬────────────────┘
                              │
              ┌───────────────▼────────────────┐
              │      AI/ML TIER                │
              │  ┌─────────────────────────┐   │
              │  │  Advisory Engine        │   │
              │  │  (Python FastAPI)       │   │
              │  │  • Crop Recommendations │   │
              │  │  • Fertilizer Schedules │   │
              │  └─────────────────────────┘   │
              │  ┌─────────────────────────┐   │
              │  │  Vision Engine          │   │
              │  │  (Python FastAPI)       │   │
              │  │  • Pest Detection       │   │
              │  │  • Disease Identification│  │
              │  └─────────────────────────┘   │
              └───────────────┬────────────────┘
                              │
              ┌───────────────▼────────────────┐
              │         DATA TIER              │
              │  ┌─────────────────────────┐   │
              │  │  PostgreSQL Database    │   │
              │  │  • Farmers              │   │
              │  │  • Soil Profiles        │   │
              │  │  • Crop History         │   │
              │  │  • Advisory Sessions    │   │
              │  │  • Feedback             │   │
              │  │  • Notifications        │   │
              │  └─────────────────────────┘   │
              │  ┌─────────────────────────┐   │
              │  │  Redis Cache            │   │
              │  │  • OTPs (10 min TTL)    │   │
              │  │  • Tokens (30 day TTL)  │   │
              │  │  • Weather (6 hr TTL)   │   │
              │  │  • Prices (12 hr TTL)   │   │
              │  └─────────────────────────┘   │
              └────────────────────────────────┘

          External APIs (Consumed by Application Services):
          • OpenWeatherMap (Weather Data)
          • Agmarknet (Market Prices)
          • Google Cloud Speech (STT/TTS)
          • Firebase FCM (Push Notifications)
          • Twilio/MSG91 (OTP SMS)
```

*Figure 4.1: System Architecture Diagram*

### 4.1.3 Deployment Architecture

**Development Environment**:
- Docker Compose orchestrates all services
- Each service runs in its own container
- Volumes persist database data between restarts
- Internal Docker network for inter-service communication

**Production Environment** (Recommended):
- Kubernetes cluster with separate namespaces for services
- Load balancer distributing traffic to API Gateway instances
- Auto-scaling based on CPU/memory utilization
- Database and Redis as managed services (AWS RDS, ElastiCache)
- CDN for serving static frontend assets
- Continuous deployment via CI/CD pipeline (GitHub Actions, GitLab CI)

### 4.1.4 Communication Patterns

**Client ↔ API Gateway**: HTTPS/REST with JWT bearer tokens
**API Gateway ↔ Application Services**: Internal HTTP/REST over Docker network
**Application Services ↔ AI/ML Services**: Internal HTTP/REST over Docker network
**Application Services ↔ Data Tier**: Direct database connections (PostgreSQL wire protocol, Redis protocol)
**Application Services ↔ External APIs**: HTTPS/REST with API key authentication

### 4.1.5 Security Architecture

**Authentication Flow**:
1. Farmer submits mobile number → User Service generates OTP → stored in Redis (10 min TTL) → sent via SMS
2. Farmer submits OTP → User Service validates → issues JWT access token (1 hour) and refresh token (30 days)
3. Refresh token stored in Redis with farmer ID as key
4. All subsequent requests include JWT in Authorization header
5. API Gateway validates JWT signature and expiration before routing

**Authorization**:
- Role-based access control (RBAC) with roles: farmer, extension_officer, admin
- JWT payload contains user ID and role
- Each service endpoint checks required role before processing

**Data Protection**:
- All external communication via HTTPS with TLS 1.2+
- Database connections encrypted
- Passwords hashed using bcrypt (cost factor 12)
- API keys and secrets in environment variables, never in code
- Farmer data anonymized (SHA-256 hash) for analytics

---

## 4.2 Technology Stack

The technology stack is selected based on maturity, community support, performance, and suitability for the project requirements.

**Table 4.1: Technology Stack**

| Component | Technology | Version | Justification |
|-----------|------------|---------|---------------|
| **Backend Runtime** | Node.js | 20.x LTS | Event-driven, non-blocking I/O ideal for I/O-heavy operations; large ecosystem |
| **Backend Framework** | Express.js | 4.x | Minimalist, flexible, widely adopted; extensive middleware ecosystem |
| **Programming Language** | TypeScript | 5.x | Type safety reduces runtime errors; better IDE support and refactoring |
| **Database** | PostgreSQL | 15.x | ACID compliance, JSON support, spatial extensions, proven scalability |
| **Cache** | Redis | 7.x | In-memory speed, TTL support, pub/sub for real-time features |
| **ORM/Query Builder** | node-postgres (pg) | Latest | Lightweight, direct SQL control, no abstraction overhead |
| **Web Framework (Frontend)** | React | 18.x | Component-based, virtual DOM, huge ecosystem, easy state management |
| **Build Tool (Frontend)** | Vite | 5.x | Fast HMR, optimized builds, modern ES module support |
| **Mobile Framework** | React Native | 0.72+ | Code reuse with web (React), native performance, mature ecosystem |
| **Mobile Platform** | Expo | SDK 49+ | Simplified build/deploy, OTA updates, extensive library support |
| **AI/ML Runtime** | Python | 3.10+ | De facto standard for ML, vast library ecosystem (TensorFlow, PyTorch) |
| **AI/ML Framework** | FastAPI | 0.100+ | High performance, automatic API docs, async support, type hints |
| **Computer Vision** | OpenCV + TensorFlow/PyTorch | Latest | Industry-standard tools for image processing and deep learning |
| **Authentication** | JWT (jsonwebtoken) | Latest | Stateless, scalable, standard-compliant |
| **API Documentation** | OpenAPI 3.1 | 3.1 | Industry standard, generates interactive docs, client SDK generation |
| **Containerization** | Docker | 24.x | Consistent environments, easy deployment, resource isolation |
| **Orchestration** | Docker Compose / Kubernetes | Latest | Development (Compose) and production (K8s) orchestration |
| **Version Control** | Git + GitHub | Latest | Industry standard, excellent branching/merging, CI/CD integration |
| **Testing (JS/TS)** | Jest / Vitest | Latest | Fast, built-in mocking, snapshot testing |
| **PBT (JS/TS)** | fast-check | Latest | Property-based testing for TypeScript, 100+ generators |
| **Testing (Python)** | pytest | Latest | Simple syntax, fixtures, parameterized tests |
| **PBT (Python)** | Hypothesis | Latest | Property-based testing for Python, powerful example generation |
| **Linting (JS/TS)** | ESLint | Latest | Catches bugs, enforces code style, customizable rules |
| **Formatting** | Prettier | Latest | Consistent code formatting, editor integration |
| **Weather API** | OpenWeatherMap | API v2.5 | Free tier available, reliable, comprehensive data (forecast, alerts) |
| **Market Prices** | Agmarknet / Custom | - | Government data source, publicly accessible |
| **Speech-to-Text** | Google Cloud Speech | Latest | Multi-language support including Indic languages, high accuracy |
| **Text-to-Speech** | Google Cloud TTS | Latest | Natural-sounding voices in Hindi, Punjabi, English |
| **Push Notifications** | Firebase FCM | Latest | Free, reliable, cross-platform (Android/iOS/Web) |
| **SMS/OTP** | Twilio / MSG91 | Latest | Reliable delivery, India-specific providers |

### 4.2.1 Technology Rationale

**Node.js for Backend**: Non-blocking I/O is ideal for handling multiple concurrent API requests (weather, market prices, external ML services). JavaScript/TypeScript allows code sharing between frontend and backend (validation logic, utility functions).

**PostgreSQL over NoSQL**: Structured data (farmer profiles, soil profiles) with relationships (farmer → soil profiles → crop history). ACID transactions ensure data integrity during multi-step operations (registration → profile creation).

**Redis for Caching**: Sub-millisecond latency for frequently accessed data (weather, market prices). TTL support automatically expires stale data. Atomic operations for OTP validation.

**React for Both Web and Mobile**: Component reuse between web (React) and mobile (React Native) reduces development time. Single skill set for team. Large talent pool for future maintenance.

**Python for AI/ML**: TensorFlow and PyTorch provide pre-trained models for image classification. Fast API allows exposing ML models as REST services with minimal boilerplate.

**Docker for Deployment**: Eliminates "works on my machine" issues. Simplified deployment to any cloud provider. Easy rollback to previous versions.

---

## 4.3 Database Design

### 4.3.1 Entity Relationship Diagram

The database schema is designed to maintain referential integrity while supporting efficient queries for advisory generation.

```
┌─────────────────┐
│    farmers      │
├─────────────────┤
│ id (PK)         │───┐
│ mobile_number   │   │
│ name            │   │
│ preferred_lang  │   │
│ village         │   │
│ district        │   │
│ state           │   │
│ land_size_acres │   │
│ fcm_token       │   │
│ created_at      │   │
│ updated_at      │   │
└─────────────────┘   │
                      │
    ┌─────────────────┼─────────────────┬─────────────────┐
    │                 │                 │                 │
    ▼                 ▼                 ▼                 ▼
┌────────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│soil_profiles   │ │crop_history  │ │advisory_     │ │notifications │
├────────────────┤ ├──────────────┤ │sessions      │ ├──────────────┤
│id (PK)         │ │id (PK)       │ ├──────────────┤ │id (PK)       │
│farmer_id (FK)  │ │farmer_id (FK)│ │id (PK)       │ │farmer_id (FK)│
│plot_name       │ │soil_prof_id  │ │farmer_hash   │ │type          │
│latitude        │ │crop_name     │ │session_type  │ │payload       │
│longitude       │ │season        │ │input_params  │ │sent_at       │
│soil_type       │ │year          │ │recommend     │ └──────────────┘
│ph              │ │created_at    │ │created_at    │
│nitrogen        │ └──────────────┘ └──────┬───────┘
│phosphorus      │                         │
│potassium       │                         │
│created_at      │                         │
│updated_at      │                         ▼
└────────────────┘                   ┌──────────────┐
                                     │feedback      │
                                     ├──────────────┤
                                     │id (PK)       │
                                     │advisory_     │
                                     │session_id(FK)│
                                     │rating        │
                                     │created_at    │
                                     └──────────────┘
```

*Figure 4.3: Entity Relationship Diagram*

### 4.3.2 Table Schemas

**farmers**
```sql
CREATE TABLE farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_number VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(100),
  preferred_lang VARCHAR(10) NOT NULL DEFAULT 'en',
  village VARCHAR(100),
  district VARCHAR(100),
  state VARCHAR(100),
  land_size_acres NUMERIC(8,2),
  fcm_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_farmers_mobile ON farmers(mobile_number);
CREATE INDEX idx_farmers_district ON farmers(district);
```

**soil_profiles**
```sql
CREATE TABLE soil_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  plot_name VARCHAR(100),
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  soil_type VARCHAR(50),
  ph NUMERIC(4,2) CHECK (ph >= 0 AND ph <= 14),
  nitrogen NUMERIC(8,2) CHECK (nitrogen >= 0),
  phosphorus NUMERIC(8,2) CHECK (phosphorus >= 0),
  potassium NUMERIC(8,2) CHECK (potassium >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_soil_profiles_farmer ON soil_profiles(farmer_id);
CREATE INDEX idx_soil_profiles_location ON soil_profiles(latitude, longitude);
```

**crop_history**
```sql
CREATE TABLE crop_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  soil_profile_id UUID REFERENCES soil_profiles(id),
  crop_name VARCHAR(100) NOT NULL,
  season VARCHAR(20),
  year SMALLINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_crop_history_farmer ON crop_history(farmer_id);
CREATE INDEX idx_crop_history_soil_profile ON crop_history(soil_profile_id);
```

**advisory_sessions**
```sql
CREATE TABLE advisory_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_hash VARCHAR(64) NOT NULL,
  session_type VARCHAR(30) NOT NULL,
  input_params JSONB NOT NULL,
  recommendation JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_advisory_sessions_farmer_hash ON advisory_sessions(farmer_hash);
CREATE INDEX idx_advisory_sessions_type ON advisory_sessions(session_type);
CREATE INDEX idx_advisory_sessions_created ON advisory_sessions(created_at DESC);
```

**feedback**
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisory_session_id UUID NOT NULL REFERENCES advisory_sessions(id),
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_feedback_session ON feedback(advisory_session_id);
```

**notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL,
  payload JSONB NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_farmer ON notifications(farmer_id);
CREATE INDEX idx_notifications_sent ON notifications(sent_at DESC);
```

### 4.3.3 Redis Key Schema

| Key Pattern | TTL | Example | Purpose |
|-------------|-----|---------|---------|
| `otp:{mobile}` | 10 min | `otp:+919876543210` | Store OTP for verification |
| `refresh:{farmerId}` | 30 days | `refresh:123e4567-e89b-12d3-a456-426614174000` | Store refresh token |
| `weather:{lat}:{lon}` | 6 hours | `weather:30.7:76.7` | Cache weather forecast data |
| `market:{crop}:{district}` | 12 hours | `market:wheat:Bathinda` | Cache market price data |

**Table 4.2: Database Tables Overview**

| Table | Rows (Est. for 10K farmers) | Growth Rate | Key Indexes |
|-------|------------------------------|-------------|-------------|
| farmers | 10,000 | Linear with registrations | mobile_number, district |
| soil_profiles | 15,000 | 1.5 per farmer (multiple plots) | farmer_id, location |
| crop_history | 50,000 | 5 per farmer per year | farmer_id, soil_profile_id |
| advisory_sessions | 1,000,000 | 100 per farmer per year | farmer_hash, created_at |
| feedback | 500,000 | 50% of advisory sessions | advisory_session_id |
| notifications | 200,000 | 20 per farmer per year | farmer_id, sent_at |

---

