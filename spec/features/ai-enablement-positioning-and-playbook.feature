@requirements
@ui
@PORT-024
Feature: AI enablement positioning and playbook
  """
  Implement a static public/ai-enablement.html page using the shared site shell and stylesheet; link it from the homepage, include it in the static build, sitemap, and llms.txt. Keep experience claims tied to existing resume/case-study sources; label the broader playbook and sample measures as proposed.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. The homepage keeps the existing people-first headline, adds an explicit AI Enablement & Adoption Leader descriptor and brief supporting copy, and links to deeper evidence without repeating full case details.
  #   2. A dedicated AI enablement playbook distinguishes verified work from proposed methods and sample measures; it makes no unsupported enterprise-wide adoption or productivity claims.
  #
  # EXAMPLES:
  #   1. A hiring reader sees the role fit on the homepage, opens the playbook for a practical adoption approach, and can follow through to the AI-assisted quality engineering case study.
  #   2. A sample measurement framework is labeled as an illustrative proposal, while the case-study claim is explicitly limited to direct-report team use and unmeasured broader experimentation.
  #
  # ========================================
  Background: User Story
    As a hiring leader evaluating an AI enablement manager candidate
    I want to see the candidate's relevant adoption leadership experience and practical approach quickly
    So that assess role fit using clear evidence and honest limits

  Scenario: Hiring reader finds AI enablement positioning from the homepage
    Given a hiring reader opens the portfolio homepage
    When they scan the opening section
    Then they see the AI Enablement & Adoption Leader positioning and concise supporting copy
    And they can open the dedicated AI enablement approach page

  Scenario: Hiring reader can distinguish demonstrated experience from proposed program design
    Given a hiring reader opens the AI enablement approach page
    When they review the experience, playbook, and scorecard sections
    Then verified work is grounded in the resume and case studies
    And proposed program practices and illustrative measures are labeled as proposals
    And the page makes no unsupported organization-wide adoption or productivity claim
