import { RuleTester } from '@typescript-eslint/rule-tester';
import * as vitest from 'vitest';

RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;
RuleTester.afterAll = vitest.afterAll;
