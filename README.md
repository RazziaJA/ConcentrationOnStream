
# Introduction

A game of [Concentration](https://en.wikipedia.org/wiki/Concentration_(card_game)). The objective is to flip over cards two at a time seeking pairs of cards with the same rank and color.

# App States

* Game is over / not started:
    * Can select the number of suits and ranks to play with.
    * Can toggle between requiring a color match or just a rank match (if playing with 4 suits).
    * Can start a new game.
* Game is in progress:
    Matched pairs will be face up at all times, unmatched cards will be face down unless they have been selected for the next pair.
    * One card has been selected. It is face up and has a border highlight.
    * A second card has been selected. It is also face up and has a border highlight.
        * If it was a match, leave both cards visible, remove the border highlights, and begin selecting the next guess (or end the game if that was the last pair).
        * If it was not a match, wait some seconds, and then flip both guessed cards back to face down.

# Try It Out

This project is deployed on Github pages: https://razziaja.github.io/ConcentrationOnStream/

# Future Work

* General polish - spacing/sizing/colors
* Metrics - turns taken vs expected turns
* Local multiplayer
* Twitch integration with chat-based multiplayer