import { signalStore, withState, withMethods, patchState, withHooks, withComputed } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { GetBalanceUseCase } from '../../application/use-cases/get-balance.use-case';
import { Balance } from '../../domain/models/balance.model';

interface BalanceState {
  balance: Balance | null;
  loading: boolean;
  error: string | null;
}

const initialState: BalanceState = {
  balance: null,
  loading: false,
  error: null,
};

export const BalanceStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

    withComputed((store) => ({
    hasMadeFirstTransaction: computed(() =>
      !!store.balance()?.hasMadeFirstTransaction
    ),
  })),

  withMethods((store) => {
    const getBalanceUseCase = inject(GetBalanceUseCase);

    const loadBalance = () => {
      patchState(store, { loading: true, error: null });

      getBalanceUseCase.execute().subscribe({
        next: (balance) => {
          patchState(store, {
            balance,
            loading: false,
            error: null,
          });
        },
        error: () => {
          patchState(store, {
            loading: false,
            error: 'Error cargando balance',
            balance: null,
          });
        },
      });
    };

    return {
      loadBalance,
      setBalance(balance: Balance) {
        patchState(store, {
          balance,
          loading: false,
          error: null,
        });
      },
    };
  }),

  withHooks({
    onInit(store) {
      store.loadBalance();
    },
  }),
);
