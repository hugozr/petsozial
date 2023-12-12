import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { VetsService } from '../../../services/vets.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatTableModule,
    MatCardModule
  ],
  selector: 'app-health-services',
  templateUrl: './health-services.component.html',
  styleUrls: ['./health-services.component.css']
})
export class HealthServicesComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  healtServices: any[] = [];
  vetData = "";

  constructor(
    private vetsService: VetsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
    this.loadHealthServices();
  }
  async loadHealthServices() {
    const data: any = await this.vetsService.getHealthService();
    this.healtServices = [];
    data.map((elem: any) => {
      this.healtServices.push({
        id: elem.id,
        name: elem.name,
      });
    });
    this.dataSource = new MatTableDataSource(this.healtServices);
    console.log(this.dataSource);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
