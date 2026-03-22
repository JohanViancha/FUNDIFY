import { inject, Injectable } from "@angular/core";
import { FUND_REPOSITORY_TOKEN } from "../../domain/repositories/fund.tokens";

@Injectable({
  providedIn: 'root'
})
export class GetFundsUseCase {

  private repository = inject(FUND_REPOSITORY_TOKEN);

  execute() {
    return this.repository.getFunds();
  }

}
