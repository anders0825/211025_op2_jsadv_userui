Funksjoner:

Legge til bøker:
Nye bøker kan legges til ved å fylle inn tittel, forfatter, sjanger og poengsum (0–10).
Hver bok får automatisk et tidsstempel og lagres i localStorage.

Redigere bøker:
Alle felt, inkludert tittel, forfatter, sjanger og poengsum, kan redigeres direkte i listen. Endringer lagres automatisk.

Slette bøker:
Hver bok kan slettes ved å klikke på X-knappen (øvre høyre hjørne). Slettingen skjer umiddelbart og lagres i localStorage.

Tømme listen:
Knappen “Tøm liste” sletter alle bøker fra både visningen og localStorage.

Sortering:
Listen kan sorteres via nedtrekksmenyen. Du kan vise eldste bøker først (standard ved innlasting), nyeste først eller sortere etter høyest poengsum.

Vedvarende lagring:
Alle bokdata lagres i nettleserens localStorage, slik at de bevares etter at du lukker eller oppdaterer siden.

Tekniske detaljer:
Elementer opprettes dynamisk i DOM-en med document.createElement().
Hver bok identifiseres unikt gjennom en time-verdi (tidsstempel).
