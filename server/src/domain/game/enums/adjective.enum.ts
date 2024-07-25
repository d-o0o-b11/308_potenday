export const ADJECTIVES = {
  꼼꼼한: '꼼꼼한',
  솔직한: '솔직한',
  자신감있는: '자신감있는',
  사려깊은: '사려깊은',
  신중한: '신중한',
  쾌할한: '쾌할한',
  침착한: '침착한',
  내성적인: '내성적인',
  외향적인: '외향적인',
  긍정적인: '긍정적인',
  열정적인: '열정적인',
  다정한: '다정한',
  부지런한: '부지런한',
  정직한: '정직한',
  즉흥적인: '즉흥적인',
  엉뚱한: '엉뚱한',
} as const;
export type Adjective = (typeof ADJECTIVES)[keyof typeof ADJECTIVES];
