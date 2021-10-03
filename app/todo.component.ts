import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddEditTodoComponent } from './add-edit-todo.component';


interface Todo {
  content: string;
  id?: string;
  datemodified?: Date;
  isDone?: boolean;
  priority?:string;
}
@Component({
  selector: 'todo',
  templateUrl: './todo.component.html',
})

export class TodoComponent implements OnInit {
  todoCollection: AngularFirestoreCollection<Todo>;
  todoList: Observable<Todo[]>;
  //todoList: Todo[];
  todoDoc: AngularFirestoreDocument<Todo>;
  inputId: string;
  inputValue: Todo = {
    content: "",
    priority:"",
  }
  
  contentAsc : boolean = true;

  editValue: boolean = false;
  constructor(public afs: AngularFirestore, public snackBar: MatSnackBar, public dialog: MatDialog) {
  }
  ngOnInit() {

    
    this.todoCollection = this.afs.collection('Todolist');
    this.todoList = this.afs.collection('Todolist', ref => ref.orderBy('content')).snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Todo;
        data.id = a.payload.doc.id;
        this.contentAsc = true;
        console.log(data);
        return data;
      })
    })
    
  }

  addNewItem(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
 
    dialogConfig.data = this.inputValue;
    const dialogRef = this.dialog.open(AddEditTodoComponent, dialogConfig);
    

    dialogRef.afterClosed().subscribe((result) => {
    
      console.log('The dialog was closed', result);
    });
  }


  deleteItem(i) {
    this.todoDoc = this.afs.doc(`Todolist/${i}`);
    this.todoDoc.delete();
    this.openSnackBar("Item Deleted!", "Dismiss");
  }


  editItem(i) {
    
    this.inputValue.content = i.content;

    this.inputValue.priority = i.priority;
    this.inputValue.datemodified = i.datemodified;
    this.inputValue.id = i.id;
    this.inputValue.isDone = i.isDone;
    

    this.editValue = true;
    this.inputId = i.id;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = this.inputValue;
    const dialogRef = this.dialog.open(AddEditTodoComponent, dialogConfig);
  }

  markItemAsDone(item) {
    this.inputValue.content = item.content;
    this.inputValue.isDone = true;
    this.todoDoc = this.afs.doc(`Todolist/${item.id}`);
    this.todoDoc.update(this.inputValue);
    this.inputValue.content = "";
    this.openSnackBar("Item Done!", "Dismiss");
  }
  markItemAsNotDone(item) {
    this.inputValue.content = item.content;
    this.inputValue.isDone = false;
    this.todoDoc = this.afs.doc(`Todolist/${item.id}`);
    this.todoDoc.update(this.inputValue);
    this.inputValue.content = "";
    this.openSnackBar("Item Not Done!", "Dismiss");
  }

  
  sortByName(){

    if( this.contentAsc === true){

    //this.todoCollection = this.afs.collection('Todolist');
    this.todoList = this.afs.collection('Todolist', ref => ref.orderBy('content','desc')).snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Todo;
        data.id = a.payload.doc.id;
        
        this.contentAsc =false;
        return data;        
      })
    })
  }else{
    this.todoList = this.afs.collection('Todolist', ref => ref.orderBy('content')).snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Todo;
        data.id = a.payload.doc.id;
       
        this.contentAsc =true;
        return data;
      })
    })
  }
  }

 

  

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
    });
  }
  toggleCheck(i) {

  }
}
