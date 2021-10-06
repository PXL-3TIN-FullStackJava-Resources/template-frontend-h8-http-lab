# H8 Http requests & RxJS
In deze lab maken we gebruik van http requests om data te voorzien in onze applicatie. Deze applicatie is uitgerust met een `inmemory-web-api` die we zullen gebruiken om de http requests te simuleren. De implementatie van deze inmemory-web-api zien we in het volgende hoofdstuk. Het gebruik kan je toepassen zonder kennis van deze service. Je kan ook altijd je eigen backend schrijven in .NET of Java voor deze oefening.

Gegeven is deze repo. Hierin staat een Angular project met reeds een confessions applicatie uit de vorige labs. **Navigeer naar deze folder via de CLI** en voer volgend commando uit: ```npm install```
 
Vervolgens voer je, nog steeds in deze folder, het commando ```ng serve -o``` uit. Hiermee zal de applicatie gestart worden en gaat er automatisch een browser open. Moest dit laatste niet het geval zijn, surf je naar http://localhost:4200. Bij elke aanpassing in de code zal de browser automatisch refreshen.

![alt_text](https://i.imgur.com/TT9FcyW.png "image_tooltip") Bekijk voor het starten van de lab de applicatie code. Leg hierbij de focus op de `add-confession` component en de implementatie van het formulier. Bekijk daarnaast ook de werkijk van de `confession.service`.

# HTTP requests
Zoals reeds beschreven maken we in dit project gebruik van een `inmemory-web-api`. deze API is reeds geimplementeerd, dus daar gaan we ons verder niets van aantrekken. De API zorgt, bij het opstarten van de applicatie, voor volgende endpoints die we kunnen gebruiken:
```ts
  // for requests to an `api` base URL that gets heroes from a 'confessions' collection 
  GET api/confessions          // all confessions
  GET api/confessions/42       // the confession with id=42
  GET api/confessions?post=^j  // 'j' is a regex; returns confessions whose post starting with 'j' or 'J'
  GET api/confessions.json/42  // ignores the ".json"
  POST api/confessions         // add new confessions object
  PUT api/confessions          // update confessions object based on boject id
  DELETE api/confessions/2     // remove confessions object with id=2
```

We starten met de nodige import in de `app.module.ts` file:
```ts
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemConfessionService),
    HttpClientModule
  ],
```

`confession.service.ts`
```typescript
export class ConfessionService {
  confessionList: Confession[] = [
    new Confession('Mondays are the worst','PXL-Digital','anonymous', true),
    new Confession('Angular beats VueJS any day','PXL-Digital','anonymous', true),
    new Confession('Taxes taxes taxes','PXL-Business','anonymous', false),
    new Confession('Am i an artist yet','PXL-MAD','banksy', false)
  ]
  apiurl: string = 'api/confessions';

  constructor(private http: HttpClient) { }
}
```

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

```ts
import { map } from 'rxjs/operators'
```

`app.component.ts`
```ts
ngOnInit(): void{
    //this.dataList = this.confessionService.confessionList;
    this.confessionService.getConfessions().subscribe();
  }
```
je ziet nu in de console / network tab van je development tools de http request


# Model casting
`confession.service.ts`
```ts
  getConfessions(): Observable<Confession[]>{
    return this.http.get<Confession[]>(this.apiurl);
  }
```
# Implementatie GET
`app.component.ts`
```ts
export class AppComponent implements OnInit {
  // dataList!: Confession[];
  confessions$!: Observable<Confession[]>;
  
  constructor(private confessionService: ConfessionService){
  }

  ngOnInit(): void{
    //this.dataList = this.confessionService.confessionList;
    this.confessions$ = this.confessionService.getConfessions();
  }
```
`app.component.html`
```html
<app-confession-item *ngFor="let item of confessions$ | async" [confession]="item">
  ```
# Implementatie POST

# Implementatie PUT

# Implementatie delete

# Filtering