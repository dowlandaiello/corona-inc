# corona-inc

> Coronavirus, but it&#39;s plague inc.

## What is this?

This repository contains the source code for [itzcoronatime](https://itzcoronatime.com), an interactive map based off the
Plague, Inc. mobile game.

!(image)[https://i.imgur.com/GEliASY.jpg]

## FAQs

1. "Why isn't the map loading correctly?"

   In order to use the google maps API in a production environment, you must [obtain an API key](https://developers.google.com/maps/documentation/javascript/get-api-key). Once you've done so, simply set `VUE_APP_GOOGLE_MAPS_API_KEY` in a `.env` file in this repository's root.

   In development environments, you shouldn't need to use an API key, but the map will be rendered with a watermark.

### Development

In order to start contributing to this waste of time, simply:

```zsh
# Install dependencies
yarn

# Start a development server
yarn dev
```
