# CSC12002 - DA#3: Dental Clinic Management System - Server

This is the repo for the server of the Dental Clinic application project for the course CSC12002 - Advanced Database at HCMUS.

## Docs & Diagrams

The docs & diagrams of the project can be found [here](https://github.com/nhthieu/dental-clinic-docs)

## Client

The repo for the UI (Client) can be found [here](https://github.com/nhthieu/dental-clinic-client)

## Quick start

### Prerequisites

- Nodejs
- npm
- SQL Server

### Install dependencies

```bash
npm i
```

### Initialize the database

1. Connect to SQL Server

- Open SQL Server Configuration Manager
- Locate `SQL Server Network Configuration` and expand it
- Click on `Protocols for MSSQLSERVER`
- Right-click on `TCP/IP` and select `Enable` (if it is not already enabled)
- Click on the `properties` of `TCP/IP` and select the `IP Addresses` tab
- Scroll down to `IPAll` and set the `TCP Port` to `1433` (or any other port you want to use)

2. .env file

- Create a `.env` file in the root directory of the project
- Copy the contents of `.env.example` into `.env`
- Change the values of the variables in `.env` to match your SQL Server configuration
- Default value for `PORT` is `1433`
- The script we used to create the database with the name `DentalClinicDev` is in [init.sql](https://github.com/nhthieu/dental-clinic-database/blob/main/src/init.sql) file of the `dental-clinic-database` repo. You can use it to create the database and tables. Or if you want you can restore the backup for our database used for testing [here](https://drive.google.com/file/d/19hX4QG41Mtk_7PfUi3FokmyGdKGaU6ZM/view).

3. Pull the db

- After you have created the database, you can pull the database to use with `prisma`, run `npx prisma db pull` in the root directory of the project
- Then run `npx prisma generate` to generate the prisma client

### Run the server

```bash
npm run dev
```

## Contributors

- [Hieu Nguyen Ho Trung](https://github.com/nhthieu)
- [Nam Vu Hoai](https://github.com/namhoai1109)
- [Man Nguyen Huynh](https://github.com/nhman2002)
- [Trung Thieu Vinh](https://github.com/tvtrungg)
