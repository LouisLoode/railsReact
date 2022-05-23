# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Objective, type: :model do
  subject { objective }

  let(:objective) { build(:objective) }

  it 'is valid with valid attributes' do
    expect(subject).to be_valid
  end

  it 'is not valid without a title' do
    subject.title = nil
    expect(subject).not_to be_valid
  end

  it 'is valid without a weight' do
    subject.weight = nil
    expect(subject).to be_valid
  end

  it 'is not valid with a weight bigger than 100' do
    subject.weight = 101
    expect(subject).not_to be_valid
  end

  it 'is not valid with a weight less than 1' do
    subject.weight = 0
    expect(subject).not_to be_valid
  end
end
