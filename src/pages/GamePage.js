import { historyRouter, ROUTE_PATH } from '~src/router';
import { div, p, span, button, input } from '~utils/vDom';
import Timer from '~utils/timer';
import { getAverage } from '~utils/getAverage';
import { getFetch } from '~api/fetch';

import ComponentBase from '~components/ComponentBase';

const $WordInput = new ComponentBase();
const $QuestionText = new ComponentBase();
const $Time = new ComponentBase();
const $Score = new ComponentBase();
const $GameControlBtn = new ComponentBase();

const initState = {
  questionText: '문제 단어',
  time: '-',
  score: '-',
};

class GamePage {
  constructor() {
    this.isStarted = false;
    this.timer = new Timer();
    this.questions = [];
    this.qIndex = 0;
    this.score = null;
    this.allTimes = [];
  }

  finishGame() {
    const { score, allTimes } = this;
    const averageTime = getAverage(allTimes);

    historyRouter(ROUTE_PATH.ScorePage, { score, averageTime });
  }

  setNextQuestion(qIndex) {
    this.qIndex = qIndex;
    this.timer.finish();
    $WordInput.update({ value: '', focus: true });
    if (this.questions.length - 1 < qIndex) return this.finishGame();

    const { text: question, second } = this.questions[qIndex];
    $QuestionText.update({ innerText: question });
    $Score.update({ innerText: this.score });

    this.timer.start(
      (time) => {
        $Time.update({ innerText: time });
        if (!time) {
          this.score -= 1;
          this.setNextQuestion(qIndex + 1);
        }
      },
      second,
      true
    );
  }

  initGameSetting() {
    this.isStarted = false;
    this.timer.finish(() => {
      $Score.update({ innerText: initState.score });
      $Time.update({ innerText: initState.time });
      $QuestionText.update({ innerText: initState.questionText });
    });
    $GameControlBtn.update({ innerText: '시작' });
    $WordInput.update({ value: '', disabled: true });
  }

  async handleStartBtn() {
    if (this.isStarted) this.initGameSetting();
    else {
      this.isStarted = true;
      $GameControlBtn.update({ innerText: '초기화' });
      $QuestionText.update({ innerText: 'Start!' });
      $WordInput.update({ disabled: false, focus: true });
      try {
        const result = await getFetch(
          'https://my-json-server.typicode.com/kakaopay-fe/resources/words'
        );
        this.questions = result;
        this.score = result.length;
        $Score.update({ innerText: this.score });
        this.setNextQuestion(0);
      } catch (err) {
        throw new Error(err);
      }
    }
  }

  handleInputKeyUp(event) {
    if (event.key !== 'Enter') return;
    const { text: question, second } = this.questions[this.qIndex];
    if (event.target.value !== question) {
      $WordInput.update({ value: '' });
      $WordInput.addClass('error');
      setTimeout(() => $WordInput.removeClass('error'), 500);
      return;
    }

    this.allTimes.push(second);
    this.setNextQuestion(this.qIndex + 1);
  }

  render() {
    const { handleStartBtn, handleInputKeyUp } = this;

    return div(
      { className: 'container' },
      div({ className: 'content-wrapper' }, [
        div([
          div({ className: 'question-board' }, [
            p(
              { className: 'question-board__time' },
              `남은 시간 : `,
              $Time.render({
                element: span(this.isStarted ? this.score : initState.time),
                className: 'question-board__time',
              }),
              '초'
            ),
            p(
              { className: 'question-board__score' },
              `점수 : `,
              $Score.render({
                element: span(
                  this.isStarted
                    ? this.score !== null
                      ? this.score.toString()
                      : initState.score
                    : initState.score
                ),
                className: 'question-board__score',
              }),
              '점'
            ),
          ]),
          $QuestionText.render({
            className: 'question-text',
            element: p(
              this.isStarted
                ? this.questions[this.qIndex]
                  ? this.questions[this.qIndex].text
                  : initState.questionText
                : initState.questionText
            ),
          }),
        ]),
        div({ className: 'game-control' }, [
          div(
            $WordInput.render({
              disabled: !this.isStarted,
              placeholder: '입력',
              className: 'game-control__input',
              onkeyup: handleInputKeyUp.bind(this),
              element: input(),
            })
          ),
          $GameControlBtn.render({
            element: button(this.isStarted ? '초기화' : '시작'),
            type: 'button',
            className: 'game-control__button',
            onclick: handleStartBtn.bind(this),
          }),
        ]),
      ])
    );
  }
}

export default GamePage;
