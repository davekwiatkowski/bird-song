# HackDuke
2017 Hackathon at Duke University

BirdCLEF challenge new approach
http://ceur-ws.org/Vol-1609/16090560.pdf
http://ceur-ws.org/Vol-1866/invited_paper_8.pdf
Issues currently:
- Very different sized sound recordings—up to 45 minutes!
- Can have multiple bird sounds in one recording
- May have background noise
- Not very accurate

Our solutions:
While machine learning is not good with detecting what exact bird is in the call, we can better detect if there are calls and where they are with higher accuracy because it is a far easier problem. This allows us to thin down the dataset to a digestable amount that is short and informative.

We can solve the multiple bird sounds in one recording by either taking advantage of multiple microphones through the classic cocktail problem to isolate birds in seperate recordings, or rely on the power of the human brain to single out certain sounds. 

Background noise can be a big problem for a algorithm, but the human brain can do a great job of handling noise.

Swarm learning is quite accurate, especially because our methodolgy takes into account a persons experience on the website. Swarm AI had already proven itself by predicting the kentucky derby back in 2016!

