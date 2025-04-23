import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeRoleComponent } from './upgrade-role.component';

describe('UpgradeRoleComponent', () => {
  let component: UpgradeRoleComponent;
  let fixture: ComponentFixture<UpgradeRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
