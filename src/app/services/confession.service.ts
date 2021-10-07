import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Confession } from '../models/confession.model';

import { map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ConfessionService {
  confessionList: Confession[] = [
    new Confession('Mondays are the worst','PXL-Digital','anonymous', true),
    new Confession('Angular beats VueJS any day','PXL-Digital','anonymous', true),
    new Confession('Taxes taxes taxes','PXL-Business','anonymous', false),
    new Confession('Am i an artist yet','PXL-MAD','banksy', false)
  ]

  constructor() { }

}
