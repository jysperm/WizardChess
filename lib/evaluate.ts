import * as _ from 'lodash';
import {Camp, Situation} from './notation';
import * as rules from './rules';

export default function evaluate(situation: Situation, camp: Camp): number {
  return _.sum(situation.getSlots().map( (chess, index) => {
    if (chess && chess.camp == camp) {
      return rules.of(chess).getScore(situation, index);
    } else {
      return 0;
    }
  }));
}
