import { historyRouter, ROUTE_PATH } from '~src/router';
import { div, p, button } from '~utils/vDom';
import ConfetiComponent from '~components/ConfetiComponent';
class ScorePage {
  handleRestartGame() {
    historyRouter(ROUTE_PATH.GamePage);
  }

  render() {
    const { handleRestartGame } = this;

    if (!history.state) {
      alert('게임을 진행하지 않았습니다. 게임을 진행해주세요');
      return historyRouter(ROUTE_PATH.GamePage);
    }

    return div({ className: 'container' }, [
      ConfetiComponent(),
      div({ className: 'content-wrapper' }, [
        p({ className: 'complete-banner' }, 'Mission Complete!'),
        p(
          { className: 'point-banner' },
          `당신의 점수는 ${history.state.score}점입니다`,
        ),
        p(
          { className: 'average-time-banner' },
          `단어당 평균 답변 시간은 ${history.state.averageTime}초 입니다.`,
        ),
        div(
          { className: 'average-time-banner-wrapper' },
          button(
            {
              type: 'button',
              className: 'game-control__button',
              onclick: handleRestartGame,
            },
            '다시시작',
          ),
        ),
      ]),
    ]);
  }
}

export default ScorePage;
