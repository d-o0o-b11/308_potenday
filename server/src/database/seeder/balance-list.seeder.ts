import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class BalanceListSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const questions = [
      {
        type_A: '불편한 상사랑 점심마다 소고기',
        type_B: '짱 편한 동료랑 점심마다 컵라면 종류 고정',
      },
      {
        type_A: '브레인 팀에서 숨쉬듯 자괴감 느끼기',
        type_B: '내가 팀 내 유일한 희망되기',
      },
      {
        type_A: '연봉 2500 / 5시 칼퇴 / 퇴근 후 자유',
        type_B: '연봉 6000 / 9시 야근 / 퇴근 후 연락',
      },
      {
        type_A:
          '피 땀 눈물 흘려 완성한 제안서 사이 안 좋은 상사가 자기 이름으로 내기',
        type_B:
          '피 땀 눈물 흘려 완성한 제안서 저장 전 컴퓨터 꺼져서 날리기(복구 안됨)',
      },
    ];

    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];
      /**
       * INSERT ON CONFLICT
       * 데이터가 이미 존재하는 경우 업데이트되도록
       */
      await dataSource.query(
        `INSERT INTO public.balance_list (id, "type_A", "type_B") VALUES ($1, $2, $3);`,
        [index + 1, question.type_A, question.type_B],
      );
    }
  }
}
