import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class AdjectiveExpressionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const adjectives = [
      '꼼꼼한',
      '솔직한',
      '자신감있는',
      '사려깊은',
      '신중한',
      '쾌활한',
      '침착한',
      '내성적인',
      '외향적인',
      '긍정적인',
      '열정적인',
      '다정한',
      '부지런한',
      '정직한',
      '즉흥적인',
      '엉뚱한',
    ];

    for (let index = 0; index < adjectives.length; index++) {
      const adjective = adjectives[index];

      /**
       * INSERT ON CONFLICT
       * 데이터가 이미 존재하는 경우 업데이트되도록
       * 고정값이여야 한다.
       */
      await dataSource.query(
        `INSERT INTO public.adjective_expression (id, adjective) VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET adjective = EXCLUDED.adjective;`,
        [index + 1, adjective],
      );
    }
  }
}
