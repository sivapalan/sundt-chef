# sundt-chef

sundt-chef provides serverless functions (API and Dialogflow interface) and a CLI to get the lunch menu at Sundtkvartalet.

The menu is fetched from the following URL: [http://sundtkvartalet.eurest.no/ukens-meny/](http://sundtkvartalet.eurest.no/ukens-meny/).

- [Installation](#installation)
- [CLI](#cli)
  - [Global Installation](#global-installation)
  - [Usage](#usage)
- [Dialogflow Fulfillment Webhook](#dialogflow-fulfillment-webhook)
  - [dialogflowChefFulfillment](#dialogflowcheffulfillment)
- [API](#api)
  - [getMenuForDay](#getmenuforday)
  - [getMenusForWeek](#getmenusforweek)

## Installation

- Install dependencies
  ```sh
  npm install
  ```

- Add a `.env` file in the project's root directory, and specify a value for the following key:

  Key                         | Description
  :-------------------------- | :-----------------------
  `MEMCACHED_BUCKET_ENDPOINT` | URL for Memcached Bucket

## CLI

### Global Installation

Run the following command from the root of the project to make the CLI available globally:
```sh
npm install -g
```

### Usage

```sh
sundt-chef [<day-of-week>]
```

Parameter       | Description
:-------------- | :-------------------------------------------------------------------------------------
`<day-of-week>` | Optional. A number representing the day of the week: 1 for Monday, 2 for Tuesday, etc.

If `<day-of-week>` is specified, _sundt-chef_ will fetch the menu for the specified day. Otherwise, it will fetch the menu for the current day.

## Dialogflow Fulfillment Webhook

### dialogflowChefFulfillment

**Path:** `/dialogflowChefFulfillment`

This function handles requests from a Dialogflow agent, and responds with data formatted to be displayed in Slack. This allows users to query a bot through a conversational interface to get the lunch menu for a given day.

## API

### getMenuForDay

**Path:** `/getMenuForDay`

Get the lunch menu for the current day as JSON.

To get the menu for a different day of the week, the day must be specified using a query parameter named `day` with a value between 1 and 5 (Monday - Friday).

#### Example response

```json
[
  {
    "name": "Kyllinglår med potetbåter",
    "price": "kr 65 / kr 43"
  },
  {
    "name": "Betasuppe",
    "price": "kr 29 / kr 24"
  },
  {
    "name": "Indisk currysuppe",
    "price": "kr 29 / kr 24"
  },
  {
    "name": "Svinenakke",
    "price": "kr 32 / kr 23"
  },
  {
    "name": "Bagel med bacon og eggerøre",
    "price": "kr 62 / kr 41"
  },
  {
    "name": "Salat med kylling og cæsardressing",
    "price": "kr 62 / kr 41"
  },
  {
    "name": "Smoothie med mango, fersken og pasjonsfrukt",
    "price": "kr 29 / kr 19"
  },
  {
    "name": "Overtidsmat: Kyllingfilet med ris og grønnsaker",
    "price": "kr 95"
  }
]
```

### getMenusForWeek

**Path:** `/getMenusForWeek`

Get the lunch menu for the entire week as JSON.
