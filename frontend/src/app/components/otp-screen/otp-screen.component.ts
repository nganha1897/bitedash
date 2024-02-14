import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global/global.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { OtpInputComponent } from '../otp-input/otp-input.component';

@Component({
  selector: 'app-otp-screen',
  templateUrl: './otp-screen.component.html',
  styleUrls: ['./otp-screen.component.scss'],
  standalone: true,
  imports: [IonicModule, OtpInputComponent]
})
export class OtpScreenComponent implements OnInit {

  @Input() sendOtp = false;
  otp: string;
  length: number;
  @Output() verified: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private global: GlobalService,
    private profile: ProfileService
  ) { }

  ngOnInit() {
    if(this.sendOtp) this.resend();
  }

  getOtpLength(length) {
    this.length = length;
  }

  onOtpChange(otp) {
    this.otp = otp;
  }

  resend() {
    this.global.showLoader();
    this.profile.resendOtp()
    .then(response => {
      this.global.hideLoader();
      if(response?.success) this.global.successToast('An OTP is sent to your email for email verification');
    })
    .catch(e => {
      this.global.hideLoader();
      let msg = 'Something went wrong! Please try again!';
      this.global.checkErrorMessageForAlert(e, msg);
    });
  }

  verify() {
    if(this.otp?.length != this.length) return this.global.showAlert('Please enter proper OTP');
    this.global.showLoader();
    this.profile.verifyEmailOtp({ verification_token: this.otp })
    .then(response => {
      this.global.hideLoader();
      this.global.successToast('Your email is verified successfully');
      this.verified.emit(true);
    })
    .catch(e => {
      this.global.hideLoader();
      let msg = 'Something went wrong! Please try again!';
      this.global.checkErrorMessageForAlert(e, msg);
    });
  }
}