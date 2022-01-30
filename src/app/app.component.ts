import { Component, OnInit } from '@angular/core';
import { of, combineLatest, timer, concat, interval, merge, forkJoin, zip, Observable } from 'rxjs';
import {  delay, map, mapTo, take, withLatestFrom } from 'rxjs/operators';

interface objSample {
  sourceOne: Observable<string>,
  sourceTwo: Observable<string>,
  sourceThree: Observable<number>,
  sourceFour: Observable<number>
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'rxjs-basics';

  ngOnInit(): void {
    //alert();
    //this.pipe_map_eg();
    //this.combineLatest_eg();
    //this.concat_eg();
    //this.merge_eg();
    //this.withLatestFrom_eg();
    //this.forkJoin_eg();
    this.zip_eg();
  }

  pipe_map_eg(): void {
    const source = of(1, 2, 3, 4, 5);
    const example = source.pipe(map(val => val * 10));
    const subscribe = example.subscribe(val => console.log(val));
  }

  combineLatest_eg(): void {
    console.log(new Date() + "Start of method combineLatest_eg()");
    // timerOne emits first value at 3s, then once every 4s
    const timerOne$ = timer(3000, 4000);
    // timerTwo emits first value at 2s, then once every 4s
    const timerTwo$ = timer(2000, 4000);
    // timerThree emits first value at 1s, then once every 4s
    const timerThree$ = timer(1000, 4000);

    // when one timer emits, emit the latest values from each timer as an array
    // .pipe(take(5) to stop after first 5 values instead of infinite value generation
    combineLatest(timerOne$.pipe(take(5)), timerTwo$.pipe(take(5)), timerThree$.pipe(take(5))).subscribe(
      ([timerValOne, timerValTwo, timerValThree]) => {
        /*
          Example:
        timerThree first tick: 'Timer One Latest: 0, Timer Two Latest: 0, Timer Three Latest: 0
        timerOne second tick: 'Timer One Latest: 1, Timer Two Latest: 0, Timer Three Latest: 0
        timerTwo second tick: 'Timer One Latest: 1, Timer Two Latest: 1, Timer Three Latest: 0
      */
        console.log( new Date() +
          `Timer One Latest: ${timerValOne},
           Timer Two Latest: ${timerValTwo},
           Timer Three Latest: ${timerValThree}`
        );
      }
    );
  }

  concat_eg():void {
    concat(
      of(1, 2, 3),
      // subscribed after first completes
      of(4, 5, 6),
      // subscribed after second completes
      of(7, 8, 9)
    )
      // log: 1, 2, 3, 4, 5, 6, 7, 8, 9
      .subscribe(console.log);
  }

  merge_eg(): void {
    console.log(new Date() + "Start of method merge_eg()");
    //emit every 2.5 seconds
    const first = interval(2500);
    //emit every 2 seconds
    const second = interval(2000);
    //emit every 1.5 seconds
    const third = interval(1500);
    //emit every 1 second
    const fourth = interval(1000);

    //emit outputs from one observable
    // .pipe(take(5) to stop after first 5 values instead of infinite value generation
    const example = merge(
      first.pipe(take(5), mapTo('FIRST-2.5s-Timer!')),
      second.pipe(take(5),mapTo('SECOND-2s-Timer!')),
      third.pipe(take(5), mapTo('THIRD-1.5s-Timer')),
      fourth.pipe(take(5),mapTo('FOURTH-1s-Timer'))
    );
    //output: "FOURTH", "THIRD", "SECOND!", "FOURTH", "FIRST!", "THIRD", "FOURTH"
    const subscribe = example.subscribe(val => console.log(new Date() + val));
  }

  withLatestFrom_eg(): void {
    console.log(new Date() + "Start of method withLatestFrom_eg()");
    //emit every 5s
    const source = interval(5000);
    //emit every 1s
    const secondSource = interval(1000);
    const example = source.pipe(
      withLatestFrom(secondSource),
      map(([first, second]) => {
        return `First Source (5s): ${first} Second Source (1s): ${second}`;
      })
    );
    /*
      "First Source (5s): 0 Second Source (1s): 4"
      "First Source (5s): 1 Second Source (1s): 9"
      "First Source (5s): 2 Second Source (1s): 14"
      ...
    */
    const subscribe = example.subscribe(val => console.log(new Date() + val));
  }

  forkJoin_eg(): void {
    /*
  when all observables complete, give the last
  emitted value from each as an array
  */
    /*const example = forkJoin([
      //emit 'Hello' immediately
      of('Hello'),
      //emit 'World' after 1 second
      of('World').pipe(delay(1000)),
      //emit 0 after 1 second
       interval(1000).pipe(take(1)),
      //emit 0...1 in 1 second interval
       interval(1000).pipe(take(2))
    ]);*/
    /*const example = forkJoin({
      //emit 'Hello' immediately
      sourceOne: of('Hello'),
      //emit 'World' after 1 second
      sourceTwo: of('World').pipe(delay(1000)),
      //emit 0 after 1 second
      sourceThree: interval(1000).pipe(take(1)),
      //emit 0...1 in 1 second interval
      sourceFour: interval(1000).pipe(take(4))
    });*/
    /*
     * Output:
     * { 
     *   sourceOne: "Hello", 
     *   sourceTwo: "World", 
     *   sourceThree: 0,
     *   sourceFour: 1
     * }
     */
    //const subscribe = example.subscribe(val => console.log(val));
  }

  zip_eg(): void {
    const sourceOne = of('Hello');
    const sourceTwo = of('World!');
    const sourceThree = of('Goodbye');
    const sourceFour = of('World!');
    //wait until all observables have emitted a value then emit all as an array
    const example = zip(
      sourceOne,
      sourceTwo.pipe(delay(1000)),
      sourceThree.pipe(delay(2000)),
      sourceFour.pipe(delay(3000))
    );
    //output: ["Hello", "World!", "Goodbye", "World!"]
    const subscribe = example.subscribe(val => console.log(val));
  }



}
