# Image review

[![Build Status](https://travis-ci.org/artemdemo/imgreview.svg?branch=master)](https://travis-ci.org/artemdemo/imgreview)

This project started with a simple idea - the ability to draw an arrow on a screenshot.
Yeah, I know it sounds silly, but this tool was always missing on my Linux machine.
So I decided to develop it myself.

You may ask - Why do I need it?
Imagine this: you're writing an email, and you want to show exactly what part of the screenshot you're referring to.
In this case, it's helpful to somehow mark it right?

Now, of course, you can open Paint or something similar and draw with your mouse, but it usually doesn't look good.
So I decided to solve it with my app. And here we have it - ImgReview.

![IMG review - functionality](screenshots/imgreview_functionality.gif)

## Documentation

It's stored separately - [open documentation](./documentation/README.md).

## Development

Just install packages:

```
$ yarn install
```

And start

```
$ yarn start
```

## Development with docker

Or you can develop in a docker.
All you need to do to start is to run following command:

```
$ docker-compose up
```

In order to stop you'll need:

```
$ docker-compose down
```

App will be available at http://localhost:8080/

In case you made some changes to `package.json` you'll need to rebuild it:

```
$ docker-compose up --build
```
