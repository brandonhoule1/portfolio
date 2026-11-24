@ui
@requirements
@PORT-022
Feature: Independent AI exploration page
  """
  Static portfolio route at /independent/; use existing shared site header/footer and a page-specific stylesheet. The route contains only public-source research, clearly labeled AI-assisted portfolio samples, an editable/downloadable markdown template, and a proposed personal learning plan. External company facts link to SEC or company investor-relations primary sources. No employer, workplace, client, or internal records are used.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Keep this page separate from employment case studies and use no employer, client, workplace, or internal work examples.
  #   2. Include a concise scope statement, a non-work case study, a dated public-company analysis linked to primary sources, a reusable sample artifact, an AI evaluation method, and a personal 90-day learning/build plan.
  #   3. Clearly label proposals, mockups, synthetic scenarios, and unmeasured exercises; do not invent personal experience, deployment, adoption, or results.
  #   4. Separate sourced company facts from interpretation, show source dates, and note when claims are forward-looking or time-sensitive.
  #
  # EXAMPLES:
  #   1. A visitor reads a Duolingo public-source analysis with an as-of date and links to the company's SEC filing and shareholder letter; any strategic conclusion is labeled as analysis, not inside knowledge.
  #   2. A visitor can inspect and download a reusable source-review brief template and a sample based only on public material, while seeing that it is an independent exercise with no claimed business result.
  #   3. The 90-day plan describes personal research, a small learning prototype, and evaluation of quality and limitations; it makes no reference to an employer or a job's first 90 days.
  #
  # ========================================
  Background: User Story
    As a visitor to Brandon's portfolio
    I want to explore independent AI research and personal learning projects
    So that review concrete evidence without confusing samples with employment experience

  Scenario: The independent project states a personal research question
    Given the visitor opens the Independent Studies page
    When they read the project introduction
    Then the page states the question about checking AI answers against sources
    And the work is described as independent public-source study
    And no employer or workplace example is included

  Scenario: Public company analysis distinguishes source facts from inference
    Given the visitor opens the Independent Studies page
    When they read the Duolingo analysis
    Then the analysis states its review date and links to primary sources
    And reported facts are separated from interpretation and attributed to the source
    And forward-looking statements are labeled as company guidance, not outcomes

  Scenario: Independent samples do not imply employer experience or results
    Given the visitor opens the independent case study and sample artifact
    When they inspect the case study, evaluation method, and source-review template
    Then the material is identified as a public-source portfolio exercise prepared with AI assistance
    And no employer, client, workplace, internal data, or measured business outcome is claimed
    And the visitor can download the reusable source-review template

  Scenario: Ninety-day plan is a personal learning plan
    Given the visitor opens the proposed 90-day plan
    When they review the three stages
    Then each stage focuses on personal research, a small prototype, and evaluation
    And the page makes clear that the plan is proposed and is not an employer onboarding plan
