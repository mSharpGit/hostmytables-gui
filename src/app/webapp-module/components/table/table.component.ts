import { Component, OnInit, Input } from '@angular/core';
import { Table } from 'src/app/structures/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {


  @Input() table: Table;
  @Input() left: string;
  @Input() top: string;
  @Input() width: string;
  @Input() height: string;
  @Input() borderRadius: string;

  constructor() { }

  ngOnInit() {
  }

}
