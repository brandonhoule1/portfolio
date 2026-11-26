@ui
@requirements
@PORT-030
Feature: Clarify hiring-manager fit, scope, and decision ownership
  """
  Update the existing online resume, case-study source fragment, and AI enablement scorecard; use compact text summaries within current styles. Rebuild the downloadable website resume from the online resume after content changes, leaving the canonical source resume untouched. Use no new navigation routes.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Keep AI Enablement & Adoption as the primary role positioning already used on the homepage; describe quality engineering and enterprise solution delivery as supporting experience, not competing primary titles.
  #   2. State only verified leadership scope: current technical-lead/developer management and functional budgets; prior five-person QA team; project team sizes from the supplied case narratives. Do not invent a current team count or imply ownership of product priorities.
  #   3. For each case, distinguish Brandon's decisions and contributions from work owned by the technical lead, team, business, Infrastructure, or Information Security.
  #   4. Add concise role-relevance takeaways without marketing language or unsupported results; preserve personal estimates, qualitative observations, and unmeasured-adoption caveats.
  #   5. Keep the scorecard explicitly proposed and not historical; include operating costs and employee use of regained time, and distinguish capacity from realized financial savings.
  #   6. The downloadable resume must remain aligned with the online resume; the canonical source resume stays unchanged.
  #
  # EXAMPLES:
  #   1. A hiring manager sees the online resume's AI enablement positioning and a concise leadership-scope statement, while product-priority ownership is attributed to the director.
  #   2. A hiring manager can identify Brandon's delivery and incident-response role in the acquisition project separately from the technical lead and developers, with the estimated audience still marked as personal.
  #   3. A hiring manager can see that Brandon created and embedded shared quality instructions, while the technical lead reviewed contributions and Playwright execution remained manual.
  #   4. A hiring manager can see Brandon's architecture and interface contributions to the employee portal while understanding that business requirements were set outside his team.
  #   5. The proposed scorecard lets a reader consider workflow outcomes, operating costs, and how people use time regained, without presenting any of these measures as historical results.
  #
  # ========================================
  Background: User Story
    As a hiring manager evaluating Brandon for an AI enablement or technology leadership role
    I want to understand his leadership scope, personal decisions, and relevant outcomes
    So that I can judge role fit and initiate a focused conversation with confidence

  Scenario: Hiring manager sees primary fit and verified leadership scope
    Given a hiring manager opens the online resume
    When they read the summary and leadership scope
    Then they see AI enablement as the primary positioning and quality engineering as supporting experience
    And they see current management and budget responsibility without an invented current team size
    And they see the prior five-person QA team and the director's ownership of product priorities

  Scenario: Hiring manager can distinguish acquisition delivery decisions
    Given a hiring manager opens the acquisition command center case study
    When they read Brandon's role and the incident response
    Then they can distinguish his delivery, scope, and root-cause investigation from architecture partnership and team implementation
    And the personal audience estimate and Day 1/Day 2 facts remain qualified

  Scenario: Hiring manager can distinguish quality and self-service decisions
    Given a hiring manager opens the quality and self-service case studies
    When they read Brandon's role and decision takeaways
    Then they see his ownership of shared quality instructions and the technical lead's review role
    And they see his architecture and interface contributions while business requirements remain attributed outside his team
    And manual Playwright execution and qualitative outcomes remain explicit

  Scenario: Hiring manager can evaluate proposed enablement measures
    Given a hiring manager opens the illustrative enablement scorecard
    When they read its proposed measures
    Then they see workflow outcomes, operating costs, and how employees use time regained
    And the scorecard distinguishes capacity made available from measured financial savings

  Scenario: Downloadable resume matches the online resume
    Given the online resume and downloadable website resume are available
    When a hiring manager compares the role summary, scope, experience, and contact links
    Then the material content agrees across both formats
    And the canonical source resume is unchanged
