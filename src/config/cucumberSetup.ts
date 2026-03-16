import { setJestCucumberConfiguration } from 'jest-cucumber';

/**
 * Include Gherkin tags (e.g. @smoke, @regression) in the generated Jest test
 * names so that --testNamePattern="@smoke" continues to filter tests correctly.
 */
setJestCucumberConfiguration({
  scenarioNameTemplate: (vars) => {
    const tags = vars.scenarioTags.join(' ');
    return tags ? `${tags} ${vars.scenarioTitle}` : vars.scenarioTitle;
  },
});
