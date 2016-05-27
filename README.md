FoodMe is Tinder for food delivery! It's an app I made with PhoneGap that's fully-launched for Android and iOS. As of 20160501 it makes about $20 a month :)  
  
[iOS app](https://itunes.apple.com/us/app/foodme-swipe-for-food-delivery/id1035175486?mt=8)  
[Android app](https://play.google.com/store/apps/details?id=io.foodme&hl=en)  
  
![Swipe for food!](https://lh3.googleusercontent.com/B19wHjONbvwAmKUd85Ep9FQKBUQXjIzUD0y1IEgS7Y57XPtTrqMxLVwZzwiPaZEwbQ=h900-rw)
  
![Swipe for food!](https://lh3.googleusercontent.com/nCOHPA6cs-hP8X1YqjwqHUFrE1q8vVKbSb9LAzyKERVLVNouoORgxvYFpVs1BOr8OMI=h900-rw)

0) Install bower and npm (after installing homebrew from brew.sh):

brew install npm

npm install -g bower


1) Clone the repo

2) Install Phonegap via:

$ sudo npm install -g phonegap

3) Get the node_modules directory to appear with all the stuff you need by running the following from the root directory:

$ npm install

4) Get the bower_components directory to appear with all the stuff you need by running the following from the root directory:

$ bower install

Note that bower_components will be in the www/ directory not the root directory.

5a) To build and run iOS:

cd into project directory

phoegap build ios

Open the .xcodeproj file under platforms/ios in XCode

Run the app in the simulator-- that's it!


5b) To build and run in Android:

cd into project directory

phonegap build Android

Download Android Studio and open the app in it from platforms/android.

Run it!

