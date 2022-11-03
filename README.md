# Backend API for Questions and Answers

## Tech Stack
- [node](https://nodejs.org/en/)
- [express](http://expressjs.com/)
- [postgreSQL](https://www.postgresql.org/)
- [node-postgres](https://node-postgres.com/)
- [artillery](https://www.artillery.io/docs)
- [AWS EC2](https://aws.amazon.com/)
- [nginx](https://www.nginx.com/)
- [loader.io](https://loader.io/)

## Overview
A micro-service developed to update an existing API for web-scale traffic damand

## API Design and Implemenation
-	Database Selection: provided dataset was relational and suitable for an RBDMS and selected the open-source option PostgreSQL with consideration to cost and reliability
-	Construct database schema: pgAdmin was used to extract, transform, and load data into photos, skus, features, and related tables
-	Implementation: Service Logic used the MVC design pattern to implement service logic giving the client
-	Optimization: identify and aleviate local and server related bottlenecks (see below)

## Optimization - A Phased Approach
- Pre-depolyment: conduct performance test local with artillery.io refactor database queries and index field values shared between tables
- Deployment: deployed servers on AWS EC2 and load balance with nginx

## Results
- [Postman](https://www.postman.com/) was used for initial testing (on local) for all endpoints under no load. Initial response times were obersved to be above above 1000. Indexing data fields common between tables and refactoring queries reduced the response time to the range of (40-10) ms for all endpoints.
- Subsequent load tests (on local) were conducted with [Artillery](https://www.artillery.io/docs). Significant increases in latency (> 500 ms) and error (> 1%) were observed at user loads greater than 400 requests per second. Refactoring queries, and evaluating the database produced no significant performance gains. The results suggest that hardware may be the bottleneck
- [loader.io](https://loader.io/) was used to test a single server deployed on AWS (EC2). The latency increased as compared to the same load test performed on local confirming suspected bottleneck was hardware driven. Adding two addtional servers and load balancing (round robbin) resulted in significant performance gains reducing latency from ~1500ms to below 70ms for a sustained load of 1000 request per second over 30 seconds

![Load Test for Products Endpoint](./testResults.png)
