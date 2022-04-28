require 'rails_helper'

RSpec.describe Objective, :type => :model do
  let(:objective) { build(:objective) }
  subject { objective }

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end

  it "is not valid without a title" do
    subject.title = nil
    expect(subject).to_not be_valid
  end

  it "is valid without a weight" do
    subject.weight = nil
    expect(subject).to be_valid
  end

  it "is not valid with a weight bigger than 100" do
    subject.weight = 101
    expect(subject).to_not be_valid
  end

  it "is not valid with a weight less than 1" do
    subject.weight = 0
    expect(subject).to_not be_valid
  end
end