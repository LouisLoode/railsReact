# frozen_string_literal: true

describe 'Objective management app', type: :feature do
  let(:objective) { build(:objective) }

  describe 'create objective' do
    it 'show message if there isn\'t any objectives' do
      visit '/'
      have_selector '#empty-list', text: 'No objective yet :('
    end

    it 'cannot create an objective without title' do
      visit '/'
      have_selector '#empty-list', text: 'No objective yet :('

      click_button '+ Add obj.'

      within('#new-objective-form') do
        fill_in 'title', with: ''
        fill_in 'weight', with: ''
        click_button 'Create'
      end

      within('.alert-danger') do
        expect(page).to have_content 'title can\'t be blank'
      end
    end

    it 'cannot create an objective with a weight greater than 100' do
      visit '/'
      have_selector '#empty-list', text: 'No objective yet :('

      click_button '+ Add obj.'

      within('#new-objective-form') do
        fill_in 'title', with: objective.title
        fill_in 'weight', with: 101
        click_button 'Create'
      end

      within('.alert-danger') do
        expect(page).to have_content 'weight must be less than or equal to 100'
      end
    end

    it 'create objective without weight' do
      visit '/'
      have_selector '#empty-list', text: 'No objective yet :('

      click_button '+ Add obj.'

      within('#new-objective-form') do
        fill_in 'title', with: objective.title
        fill_in 'weight', with: ''
        click_button 'Create'
      end

      expect(page).to have_content objective.title
    end

    it 'create objective with valid form' do
      visit '/'
      have_selector '#empty-list', text: 'No objective yet :('

      click_button '+ Add obj.'
      within('#new-objective-form') do
        fill_in 'title', with: objective.title
        fill_in 'weight', with: objective.weight
        click_button 'Create'
      end

      expect(page).to have_content objective.title
      expect(page).to have_content objective.weight
    end

    it 'can cancel objective creation on click on cancel button' do
      visit '/'
      have_selector '#empty-list', text: 'No objective yet :('

      click_button '+ Add obj.'

      within('#new-objective-form') do
        fill_in 'title', with: objective.title
        fill_in 'weight', with: objective.weight
      end

      click_button 'Cancel'

      have_selector '#empty-list', text: 'No objective yet :('

      expect(page).not_to have_content objective.title
      expect(page).not_to have_content objective.weight
    end
  end

  describe 'update objective' do
    let!(:objective) { create(:objective) }
    let(:objective_update) { build(:objective, weight: nil) }
    let(:objective_update2) { build(:objective) }

    it 'can update objective' do
      visit '/'

      expect(page).to have_content objective.title
      expect(page).to have_content objective.weight

      find('span', text: objective.title).click
      within('div#objective-line') do
        fill_in 'title', with: objective_update.title
        fill_in 'weight', with: ''
        click_button 'Update'
      end

      expect(page).to have_content objective_update.title
      expect(page).not_to have_content objective.title
      expect(page).not_to have_content objective.weight

      find('span', text: objective_update.title).click
      within('div#objective-line') do
        fill_in 'title', with: objective_update2.title
        fill_in 'weight', with: objective_update2.weight
        click_button 'Update'
      end

      expect(page).to have_content objective_update2.title
      expect(page).to have_content objective_update2.weight
    end

    it 'can cancel objective updating' do
      visit '/'

      expect(page).to have_content objective.title
      expect(page).to have_content objective.weight

      find('span', text: objective.title).click
      within('div#objective-line') do
        fill_in 'title', with: objective_update.title
        fill_in 'weight', with: ''
        click_button 'Cancel'
      end

      expect(page).to have_content objective.title
      expect(page).to have_content objective.weight
    end
  end

  describe 'delete objective' do
    let!(:objective) { create(:objective) }

    it 'can delete objective' do
      visit '/'

      expect(page).to have_content objective.title
      expect(page).to have_content objective.weight

      find('#delete').click

      have_selector '#empty-list', text: 'No objective yet :('
    end
  end

  describe 'weights validations' do
    describe 'message when there is any weight missing on objective' do
      it 'show invalid weight message because an objective hasn\'t weight' do
        create(:objective)
        create(:objective, weight: nil)

        visit '/'

        within('.alert-warning') do
          expect(page).to have_content 'Weights are missing on some objective(s)'
        end
      end
    end

    describe 'message when the total weight is different from 100' do
      it 'display the invalid weight message for the total weight is less than 100.' do
        create(:objective, weight: rand(1..99))

        visit '/'

        within('.alert-warning') do
          expect(page).to have_content 'You have some invalid weights !'
        end
      end

      it 'display the invalid weight message for the total weight is greater than 100.' do
        create(:objective, weight: 99)
        create(:objective, weight: 99)

        visit '/'

        within('.alert-warning') do
          expect(page).to have_content 'You have some invalid weights !'
        end
      end
    end
  end
end
