import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private angfirestore: AngularFirestore) { }
  title = 'skugal';
  todoItem = "";
  todoList: any = [];
  dataLoading = false;
  textboxconfig: AngularEditorConfig = {
    editable: true,
    height: '5rem',
    placeholder: 'Enter todo item...',

  }
  ngOnInit() {
    this.getItems().subscribe((data: any) => {

      this.todoList = data.map((e: any) => {
        return {
          id: e.payload.doc.id,
          data: e.payload.doc.data()['data']
        }

      })
    })
  }
  checkTodo() {
    if (this.todoList.length > 0)
      return false;
    else return true;
  }
  checktext() {
    if (this.todoItem.length > 0)
      return false;
    else return true;
  }
  deleteTask(index: any) {
    this.deleteItem(this.todoList[index].id);
  }
  saveData() {
    this.dataLoading = true;
    setTimeout(() => {
      this.addItem().then(resp => {
        this.dataLoading = false;
      })
    }, 500)


  }
  exportData() {
    var doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('My Todo Items', 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);

    for(let i=0;i<this.todoList.length;i++){
      var listitem=this.todoList[i].data;
      doc.text(listitem,11,15+(i*5))
    }
    
    

    doc.output('dataurlnewwindow')

    doc.save('mytodoList.pdf');
  }

  getItems() {
    return this.angfirestore.collection('items').snapshotChanges();
  }
  addItem() {
    let itementry: any = {};
    itementry['data'] = this.todoItem
    return this.angfirestore.collection('items').add(itementry);
  }
  deleteItem(index: any) {
    return this.angfirestore.doc('items/' + index).delete();
  }
}
