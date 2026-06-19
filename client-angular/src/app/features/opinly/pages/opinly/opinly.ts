import { Component } from '@angular/core';
import { OpinlyHeader } from "../../components/opinly-header/opinly-header";
import { NewOpinion } from "../../components/new-opinion/new-opinion";
import { OpinionsList } from "../../components/opinions-list/opinions-list";

@Component({
  selector: 'app-opinly',
  imports: [OpinlyHeader, NewOpinion, OpinionsList],
  templateUrl: './opinly.html',
  styleUrl: './opinly.css',
})
export class Opinly {

}
