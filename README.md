
# Introduction

A game of Concentration. The objective is to flip over cards two at a time seeking pairs of cards with the same rank and color.

# App States

* Game is over / not started:
    * Can toggle between requiring a color match or just a rank match
    * Can start a new game
* Game is in progress:
    Matched pairs will be face up at all times, unmatched cards will be face down unless they have been selected for the next pair.
    * One card has been selected. It is face up and has a border highlight
    * A second card has been selected.
        * If it was a match, leave it visible and begin selecting the next guess (or end the game if that was the last pair)
        * If it was not a match, wait some seconds, and then flip both guessed cards.