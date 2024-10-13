import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateTokenCommand } from './generate-token.command';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(GenerateTokenCommand)
export class GenerateTokenCommandHandler
  implements ICommandHandler<GenerateTokenCommand>
{
  constructor(private readonly jwtService: JwtService) {}

  async execute(command: GenerateTokenCommand) {
    const payload = {
      urlId: command.urlId,
      userId: command.userId,
    };

    return { token: this.jwtService.sign(payload) };
  }
}
