import { Injectable, computed, signal } from '@angular/core';
import { Observable, finalize } from 'rxjs';

export interface GlobalLoaderHandle {
  close: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalLoaderService {
  private readonly activeCount = signal(0);
  private readonly messages = signal<string[]>([]);

  readonly isVisible = computed(() => this.activeCount() > 0);
  readonly message = computed(() => {
    const currentMessages = this.messages();
    return currentMessages.at(-1) ?? 'Please wait...';
  });

  show(message = 'Please wait...'): GlobalLoaderHandle {
    this.activeCount.update((count) => count + 1);
    this.messages.update((messages) => [...messages, message]);

    let closed = false;

    return {
      close: () => {
        if (closed) {
          return;
        }

        closed = true;
        this.activeCount.update((count) => Math.max(0, count - 1));
        this.messages.update((messages) => {
          const nextMessages = [...messages];
          const messageIndex = nextMessages.lastIndexOf(message);

          if (messageIndex >= 0) {
            nextMessages.splice(messageIndex, 1);
          } else {
            nextMessages.pop();
          }

          return nextMessages;
        });
      },
    };
  }

  track<T>(request$: Observable<T>, message?: string): Observable<T> {
    const loaderHandle = this.show(message);
    return request$.pipe(finalize(() => loaderHandle.close()));
  }
}
