import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confession } from 'src/app/models/confession.model';

@Component({
  selector: 'app-add-confession',
  templateUrl: './add-confession.component.html',
  styleUrls: ['./add-confession.component.css']
})
export class AddConfessionComponent implements OnInit {
  myForm!: FormGroup;
  @Output() newItemEvent = new EventEmitter<Confession>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
   this.myForm = this.fb.group({
     post: ['',[Validators.required]],
     author: ['',[Validators.required]],
     department: ['',[Validators.required]]
   });
  }

  get myFormFormControls() {
    return this.myForm.controls;
  }

  onSubmit(): void{
    let newConfession: Confession = new Confession('','','',false);
    Object.assign(newConfession,this.myForm.value);
    this.newItemEvent.emit(newConfession);
  }

}
