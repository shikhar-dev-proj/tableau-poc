import { Component, OnInit } from '@angular/core';

declare var tableau: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tableau-poc';

  // initialise the viz
  vehicleModelDistributionViz: any;
  genderByCountryViz: any;
  vehicleModelByAvgPriceViz: any;
  modelGenderPriceTreemapViz: any;

  selections = {
    vehiclemodeldistribution: [],
    genderbycountry: [],
    vehiclemodelbyavgprice: [],
    'model-gender-pricetreemap': []
  };

  ngOnInit() {
    this.onMarkSelection.bind(this);
    this.loadAllViz();
    this.listenAllMarkSelections();
  }

  loadAllViz() {
    this.vehicleModelDistributionViz = this.loadViz('vehiclemodeldistribution', 'vehicleModelDistributionViz');
    this.genderByCountryViz = this.loadViz('genderbycountry', 'genderByCountryViz');
    this.vehicleModelByAvgPriceViz = this.loadViz('vehiclemodelbyavgprice', 'vehicleModelByAvgPriceViz');
    this.modelGenderPriceTreemapViz = this.loadViz('model-gender-pricetreemap', 'modelGenderPriceTreemapViz');
  }

  listenAllMarkSelections() {
    this.vehicleModelDistributionViz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, this.onMarkSelection.bind(this, 'vehiclemodeldistribution'));
    this.genderByCountryViz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, this.onMarkSelection.bind(this, 'genderbycountry'));
    this.vehicleModelByAvgPriceViz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, this.onMarkSelection.bind(this, 'vehiclemodelbyavgprice'));
    this.modelGenderPriceTreemapViz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, this.onMarkSelection.bind(this, 'model-gender-pricetreemap'));
  }

  onMarkSelection(placeholder, marksEvent) {
    console.log(this, placeholder, marksEvent);
    return marksEvent.getMarksAsync().then(marks => this.reportSelectedMarks(marks, placeholder));
  }

  reportSelectedMarks(marks: any, placeholder: string) {
    this.selections[placeholder] = [];
    marks.forEach((mark, i) => {
      const selectedMark = [];
      const pairs = marks[i].getPairs();
      pairs.forEach((p, j) => {
        selectedMark.push({ name: p.fieldName, value: p.formattedValue });
      });
      this.selections[placeholder].push(selectedMark);
    });
  };


  loadViz(sheetName: string, id: string) {
    const vizDiv = document.getElementById(id);
    const vizUrl = 'https://public.tableau.com/views/InsightsDashboard-QA-DATALAYER-01/' + sheetName;
    const options = {
      width: '900px',
      height: '1000px',
      hideToolbars: true,
      hideTabs: true,
    };
    return new tableau.Viz(vizDiv, vizUrl, options);
  }

  revertAll() {
    this.vehicleModelDistributionViz.getWorkbook().revertAllAsync();
  }

  exportData() {
    this.vehicleModelDistributionViz.showExportDataDialog();
  }

}
