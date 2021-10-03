import { Component, Inject, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';

import { Todo } from './todo.model';
@Component({
  selector: 'add-edit-todo',
  templateUrl: './add-edit-todo.component.html',
})
export class AddEditTodoComponent implements OnInit {

  todoCollection: AngularFirestoreCollection<Todo>;
  todoList: Observable<Todo[]>;
  todoDoc: AngularFirestoreDocument<Todo>;
  inputId: string;
  //id:string;
  data: Todo = {
    content: "",
    priority: "",
  }

  isEdit : boolean = false;
  editValue: boolean = false;



  todoFormGroup: FormGroup;
 
  

  constructor(
    public afs: AngularFirestore, public snackBar: MatSnackBar, public dialog: MatDialog, private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditTodoComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.data = data;
    console.log(this.data);
    
  }
  
  onContentBlur(event: any){
    console.log( event.target.value);
    if(event.target.value){
     let firstChar =  event.target.value[0].toUpperCase() + event.target.value.substr(1).toLowerCase();
     this.todoFormGroup.controls.content.setValue(firstChar);
    }
  }
 
  ngOnInit() {
    
    this.todoCollection = this.afs.collection('Todolist');
    this.todoFormGroup = this.fb.group({
      content: ['', Validators.required],
      priority: ['', Validators.required],
    });
    if(this.data.id){
      this.isEdit= true;
      this.todoFormGroup.setValue({
        content:this.data.content,
        priority:this.data.priority?this.data.priority:"",
      })
    }
  }
  editItem(i) {
    this.data.content = i.content;
    this.editValue = true;
    
    this.inputId = i.id;
  }
   addEditTodo() {
    
    if (this.data.content != "") {
      
       const todo={
        content : this.todoFormGroup.controls.content.value,
        priority : this.todoFormGroup.controls.priority.value,
        datemodified : new Date(),
        isDone :false

      }

      this.todoDoc = this.afs.doc(`Todolist/${this.data.id}`);
      this.todoDoc.update(todo);

      this.editValue = false; 
      this.data.content = "";
      this.data.priority = "";
      this.dialogRef.close(`${this.todoFormGroup.value}`);
      this.openSnackBar("Updated Successfuly!", "Dismiss");
      
    }
  }
    
    addNewTodo(){
    
      const todo={
        
        content : this.todoFormGroup.controls.content.value,
        priority : this.todoFormGroup.controls.priority.value,
        datemodified : new Date(),
       
        
        isDone :false

      }
      console.log(todo);
      this.todoCollection.add(todo);
      this.data.content = "";
      this.data.priority = "";
      this.dialogRef.close(`${this.todoFormGroup.value}`);
      this.openSnackBar("Added Successfuly!", "Dismiss");
 
        
    
    
}
  

openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 2000,
    verticalPosition: 'top',
  });
}
toggleCheck(i) {

}
 
 
  onClose() {
    this.data.content = "";
    this.data.priority = "";
    this.data.id="";
    this.dialogRef.close(`${this.todoFormGroup.value}`);
    console.log(`${this.todoFormGroup.value.content}`);
  }
}
