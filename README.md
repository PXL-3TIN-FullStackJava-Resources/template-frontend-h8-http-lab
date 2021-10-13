# H8 Http requests & RxJS
In deze lab maken we gebruik van http requests om data te voorzien in onze applicatie. Deze applicatie is uitgerust met een `inmemory-web-api` die we zullen gebruiken om de http requests te simuleren. De implementatie van deze inmemory-web-api valt buiten de scope van het project. Indien je hier meer info over wilt, kan je deze [hier](https://github.com/angular/angular/tree/master/packages/misc/angular-in-memory-web-api) terugvinden. Het gebruik kan je toepassen zonder kennis van deze service. Je kan ook altijd je eigen backend schrijven in .NET of Java voor deze oefening.

Gegeven is deze repo. Hierin staat een Angular project met reeds een confessions applicatie uit de vorige labs. **Navigeer naar deze folder via de CLI** en voer volgend commando uit: ```npm install```
 
Vervolgens voer je, nog steeds in deze folder, het commando ```ng serve -o``` uit. Hiermee zal de applicatie gestart worden en gaat er automatisch een browser open. Moest dit laatste niet het geval zijn, surf je naar http://localhost:4200. Bij elke aanpassing in de code zal de browser automatisch refreshen.

![alt_text](https://i.imgur.com/TT9FcyW.png "image_tooltip") Bekijk voor het starten van de lab de applicatie code. Leg hierbij de focus op de `add-confession` component en de implementatie van het formulier. Bekijk daarnaast ook de werkijk van de `confession.service`. Bekijk tenslotte het `confession.model.ts` bestand. Hierin is een optionele `id` property toegevoegd.

# HTTP requests
Zoals reeds beschreven maken we in dit project gebruik van een `inmemory-web-api`. deze API is reeds geimplementeerd, dus daar gaan we ons verder niets van aantrekken. De API zorgt, bij het opstarten van de applicatie, voor volgende endpoints die we kunnen gebruiken:
```ts
  // for requests to an `api` base URL that gets confessions from a 'confessions' collection 
  GET api/confessions          // all confessions
  GET api/confessions/42       // the confession with id=42
  GET api/confessions?post=^j  // 'j' is a regex; returns confessions whose post starting with 'j' or 'J'
  GET api/confessions.json/42  // ignores the ".json"
  POST api/confessions         // add new confessions object
  PUT api/confessions          // update confessions object based on boject id
  DELETE api/confessions/2     // remove confessions object with id=2
```


We starten met de nodige import in de `app.module.ts` file. Hier voeg je de `HttpClientModule` toe als import:
```ts
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemConfessionService),
    HttpClientModule
  ],
```
Vervolgens injecteren we de `HttpClient`in de constructor van de confession service in `confession.service.ts`. je voorziet ook een property `apiurl`:
```typescript
export class ConfessionService {

  apiurl: string = 'api/confessions';

  constructor(private http: HttpClient) { }
}
```
de confessionList en verwijzingen naar de confessionList mag je verwijderen (of in commentaar zetten) uit de service.

Daarnaast voeg je in de service ook onderstaande methode toe. Deze methode zorgt voor de afhandeling van de http request via de `HttpClient` van Angular. Het resultaat komt terug in json formaat:
```ts
getConfessions(): Observable<any>{
    return this.http.get(this.apiurl).pipe(
      map(data => {
        console.log(data);
        return data;
      })
    );
}
```
De map operator die je hier ziet is van de RxJS library. Voorzie volgende import in de service indien je IDE geen auto import voorziet:
```ts
import { map } from 'rxjs/operators'
```

# Model casting
Voor het casten van de JSON objecten naar Confession data doen we nog een kleine aanpassing in `confession.service.ts`:
```ts
  getConfessions(): Observable<Confession[]>{
    return this.http.get<Confession[]>(this.apiurl);
  }
```
# Implementatie GET
Hierna doen we de implementatie van deze methode in de `app.component.ts`. Start met het injecteren van de service in de constructor. Hierna voorzie je volgende code in de component:
```ts
export class AppComponent implements OnInit {
  confessions$!: Observable<Confession[]>;
  
  constructor(private confessionService: ConfessionService){
  }

  ngOnInit(): void{
    this.getConfessionList();
  }
  
  getConfessionlist(): void{
    this.confessions$ = this.confessionService.getConfessions();
  }
```
De bestaande dataList & code mag je wissen. Vervolgens doen we de nodige aanpassingen aan de `app.component.html`:
```html
<app-confession-item *ngFor="let item of confessions$ | async" [confession]="item">
  ```
De `async` pipe doet in dit geval de subscribe op onze observable `confessions$`. Indien we geen gebruik zouden maken van de async pipe, zou je moeten werken met een `subscribe()` functie in de component klasse.

Bij het laden van de applicatie zal de data nu vanuit de service via een http request opgehaald worden. 

# Implementatie POST
Voor een nieuw object toe te voegen, starten we met een toevoeging in `confession.service.ts`:
```typescript
addConfession(conf: Confession): Observable<any>{
    return this.http.post(this.apiurl, conf);
}
``` 

Hierna passen we de `processAdd` methode in `app.component.ts` aan zodat deze gebruik maakt van bovenstaande methode uit de service:
```typescript
processAdd(event: Confession): void{
    this.confessionService.addConfession(event).subscribe(data => {
      console.log(data);
      this.getConfessionlist();
    });
}
```
De functie `addConfession` vanuit de service geeft een `Observable` terug. het is belangrijk dat we hierop een `subscribe` voorzien, anders wordt de code niet uitgevoerd.
# Implementatie PUT
Voor het aanpassen van de likes en dislikes voorzien we een `PUT` request methode in de `confession.service.ts`:
```typescript
updateConfession(conf: Confession): Observable<any>{
  return this.http.put(this.apiurl, conf);
}
```
Het object dat geupdatet wordt, zal bepaald worden door de `id` van het meegegeven object.

De logica van het aanpassen van de likes en dislikes zit in`confession-item.component.ts`. Dus daar injecteren we ook de `confessionService`:
```typescript
export class ConfessionItemComponent implements OnInit {
  @Input() confession!: Confession;
  constructor(private confessionService: ConfessionService) { }
```
Daarna passen we de volgende methodes aan zodat we de `updateConfession` methode oproepen. Denk hierbij opnieuw aan de `subscribe` functie om de code effectief op te roepen:
```typescript
 addLike() {
    this.confession.likes++;
    this.confessionService.updateConfession(this.confession).subscribe();
  }
  addDislike() {
    this.confession.dislikes++;
    this.confessionService.updateConfession(this.confession).subscribe();
  }
  ```

# Filtering
We willen een filter voorzien waarbij we kunnen zoeken op keywords in de confessions. We starten met de aanpassing van de `confession.service.ts`. Voeg hierin volgende methode toe:
```typescript
getFilteredConfessions(searchTerm: string): Observable<Confession[]>{
    return this.http.get<Confession[]>(this.apiurl + '?post=' + searchTerm);
}
```
We voorzien in de `app.component.html` een input element met een `keyup` event aan gekoppeld:
```html
<p><input type="text" class="form-control" name="search" placeholder="search..." [(ngModel)]="searchTerm" (keyup)="filterItems()"/></p>
```

Voorzie ook de `searchTerm` property in `app.component.ts`:
```typescript
export class AppComponent implements OnInit {
  dataList!: Confession[];
  confessions$!: Observable<Confession[]>;
  searchTerm: string = '';
```
Tenslotte voorzien we een methode `filterItems` in `app.component.ts`:
```typescript
filterItems(): void{
    this.confessions$ = this.confessionService.getFilteredConfessions(this.searchTerm);
}
```
Deze past de `Observable` in de component aan. Door de `async` pipe in onze view wordt hierdoor onze lijst automatisch aangepast bij het triggeren van deze methode.
