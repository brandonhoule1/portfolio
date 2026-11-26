@ui
@requirements
@PORT-027
Feature: Make portfolio evidence easier for recruiters to scan
  """
  Add a recruiter guide as one linear page, linked from the homepage and shared footer. Order its sections as role fit, resume, selected evidence, AI enablement leadership approach, and contact. Use in-page next links and the shared site shell. Compare the published website resume PDF to the online resume without changing the canonical resume source.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. The homepage's recruiter call to action opens one linear guide with the ordered sections role fit, resume, selected evidence, leadership approach, and contact.
  #   2. At-a-glance case-study details must summarize each documented project accurately, including role, team/delivery scope where known, and strongest supported outcome.
  #   3. Preserve caveats for personal estimates, qualitative observations, manual execution, and unmeasured broader adoption; do not invent quantified impact.
  #   4. The online resume and downloadable website PDF must agree on material role titles, dates, education, skills, and contact links; do not alter the canonical source resume.
  #
  # EXAMPLES:
  #   1. A recruiter follows the homepage CTA through one page in order from role fit to resume, evidence, approach, and contact.
  #   2. A recruiter scanning the acquisition case sees the three-month delivery, five developers plus a technical lead, Day 1 delivery, and dashboard recovery before Day 2, with the audience estimate labeled personal.
  #   3. A recruiter scanning the quality engineering case sees shared practice adopted by direct reports, Playwright used manually, and broader adoption explicitly unmeasured.
  #   4. A recruiter scanning the self-service case sees the four-developer-and-technical-lead team, production delivery, and qualitative outcome language without a fabricated savings or adoption percentage.
  #   5. When the online resume and PDF are compared, their factual content and public contact paths agree; the canonical source resume remains unchanged.
  #
  # ========================================
  Background: User Story
    As a HR recruiter considering Brandon for a leadership role
    I want to quickly understand his fit, scope, credible outcomes, and next contact step
    So that I can decide whether to have a conversation without reading the entire site first

  Scenario: Recruiter finds the resume and contact path from the homepage
    Given a recruiter opens the homepage
    When they choose the recruiter guide
    Then they see a single-page guide with role fit, resume, selected evidence, leadership approach, and contact in that order
    And each section before contact has a clear next link within the guide
    And they can download the resume and open the contact form from the guide

  Scenario: Recruiter scans the acquisition case at a glance
    Given a recruiter opens the case studies page
    When they scan the acquisition command center summary
    Then they see the three-month delivery, five developers and a technical lead, and delivery for Day 1
    And they see the dashboard restoration before Day 2 and the audience estimate identified as personal

  Scenario: Recruiter scans the quality engineering case at a glance
    Given a recruiter opens the case studies page
    When they scan the AI-assisted quality engineering summary
    Then they see that the shared practice is used by developers reporting to Brandon
    And they see that Playwright execution is manual and broader adoption is unmeasured

  Scenario: Recruiter scans the self-service case at a glance
    Given a recruiter opens the case studies page
    When they scan the enterprise self-service summary
    Then they see the four-developer and technical-lead team and production delivery
    And they see outcomes described as qualitative observations without invented savings or adoption percentages

  Scenario: Published resume remains consistent across formats
    Given the online resume and downloadable website resume are available
    When a recruiter compares their material career and contact details
    Then role titles, dates, education, skills, and contact paths agree
    And the canonical source resume remains unchanged
